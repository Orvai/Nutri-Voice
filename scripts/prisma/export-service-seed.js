#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("node:fs/promises");
const path = require("node:path");
const { createRequire } = require("node:module");

const SPECIAL_SCALAR_TYPES = new Set(["DateTime", "BigInt", "Bytes", "Decimal"]);
const DEFAULT_OUTPUT = "prisma/seed.snapshot.js";

function redactDatabaseUrl(databaseUrl) {
  if (!databaseUrl) return "<not provided>";

  try {
    const url = new URL(databaseUrl);
    if (url.password) {
      url.password = "***";
    }
    return url.toString();
  } catch {
    return databaseUrl.replace(/:(?!\/\/)([^:@/]+)@/, ":***@");
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = value;
    i += 1;
  }
  return args;
}

function modelToDelegate(modelName) {
  return modelName.charAt(0).toLowerCase() + modelName.slice(1);
}

function queueInsertSorted(queue, value) {
  queue.push(value);
  queue.sort((a, b) => a.localeCompare(b));
}

function sortModelsByDependencies(modelMetas) {
  const names = modelMetas.map((model) => model.name);
  const nameSet = new Set(names);

  const remainingDeps = new Map();
  const dependents = new Map();

  for (const name of names) {
    remainingDeps.set(name, new Set());
    dependents.set(name, new Set());
  }

  for (const model of modelMetas) {
    const deps = model.dependencies.filter((dep) => nameSet.has(dep));
    const depSet = remainingDeps.get(model.name);
    for (const dep of deps) {
      depSet.add(dep);
      dependents.get(dep).add(model.name);
    }
  }

  const ready = names
    .filter((name) => remainingDeps.get(name).size === 0)
    .sort((a, b) => a.localeCompare(b));

  const insertOrder = [];

  while (ready.length > 0) {
    const current = ready.shift();
    insertOrder.push(current);

    for (const dependent of dependents.get(current)) {
      const deps = remainingDeps.get(dependent);
      deps.delete(current);
      if (deps.size === 0 && !insertOrder.includes(dependent) && !ready.includes(dependent)) {
        queueInsertSorted(ready, dependent);
      }
    }
  }

  if (insertOrder.length !== names.length) {
    const unresolved = names
      .filter((name) => !insertOrder.includes(name))
      .sort((a, b) => a.localeCompare(b));

    console.warn(
      "[seed-export] Warning: relation cycle detected. Appending unresolved models alphabetically:",
      unresolved.join(", "),
    );

    insertOrder.push(...unresolved);
  }

  return insertOrder;
}

function pickOrderByField(model) {
  const idField = model.fields.find(
    (field) => field.isId && !field.isList && (field.kind === "scalar" || field.kind === "enum"),
  );
  if (idField) return idField.name;

  const uniqueField = model.fields.find(
    (field) => field.isUnique && !field.isList && (field.kind === "scalar" || field.kind === "enum"),
  );
  if (uniqueField) return uniqueField.name;

  return null;
}

function getSpecialFieldTypes(model) {
  const entries = model.fields
    .filter(
      (field) =>
        (field.kind === "scalar" || field.kind === "enum") &&
        !field.isList &&
        SPECIAL_SCALAR_TYPES.has(field.type),
    )
    .map((field) => [field.name, field.type]);

  return Object.fromEntries(entries);
}

function getModelMetas(dmmfModels) {
  return dmmfModels.map((model) => {
    const dependencies = [];

    for (const field of model.fields) {
      if (
        field.kind === "object" &&
        Array.isArray(field.relationFromFields) &&
        field.relationFromFields.length > 0
      ) {
        dependencies.push(field.type);
      }
    }

    return {
      name: model.name,
      delegate: modelToDelegate(model.name),
      dependencies: [...new Set(dependencies)],
      orderByField: pickOrderByField(model),
      specialFieldTypes: getSpecialFieldTypes(model),
    };
  });
}

function encodeSpecialValue(type, value) {
  if (value === null || value === undefined) return value;

  if (type === "DateTime") {
    if (value instanceof Date) return value.toISOString();
    return new Date(value).toISOString();
  }

  if (type === "BigInt") {
    return value.toString();
  }

  if (type === "Bytes") {
    return Buffer.from(value).toString("base64");
  }

  if (type === "Decimal") {
    return value.toString();
  }

  return value;
}

function serializeRow(row, specialFieldTypes) {
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    const type = specialFieldTypes[key];
    out[key] = type ? encodeSpecialValue(type, value) : value;
  }
  return out;
}

function toLiteral(value) {
  return JSON.stringify(value, null, 2);
}

function renderSeedSnapshot({ insertOrder, deleteOrder, fieldTypes, seedData, generatedAt, sourceDbUrl }) {
  return `/* eslint-disable no-console */\n// Auto-generated by scripts/prisma/export-service-seed.js\n// Generated at: ${generatedAt}\n// Source DATABASE_URL: ${sourceDbUrl}\n\nconst { PrismaClient } = require("@prisma/client");\n\nconst prisma = new PrismaClient();\nconst BATCH_SIZE = 500;\n\nconst INSERT_ORDER = ${toLiteral(insertOrder)};\nconst DELETE_ORDER = ${toLiteral(deleteOrder)};\nconst FIELD_TYPES = ${toLiteral(fieldTypes)};\nconst SEED_DATA = ${toLiteral(seedData)};\n\nfunction modelToDelegate(modelName) {\n  return modelName.charAt(0).toLowerCase() + modelName.slice(1);\n}\n\nfunction decodeSpecialValue(type, value) {\n  if (value === null || value === undefined) return value;\n\n  if (type === "DateTime") return new Date(value);\n  if (type === "BigInt") return BigInt(value);\n  if (type === "Bytes") return Buffer.from(value, "base64");\n\n  return value;\n}\n\nfunction reviveRow(modelName, row) {\n  const types = FIELD_TYPES[modelName] || {};\n  const out = {};\n\n  for (const [key, value] of Object.entries(row)) {\n    const type = types[key];\n    out[key] = type ? decodeSpecialValue(type, value) : value;\n  }\n\n  return out;\n}\n\nasync function clearData() {\n  for (const modelName of DELETE_ORDER) {\n    const delegate = modelToDelegate(modelName);\n    if (!prisma[delegate]) {\n      throw new Error(\`Delegate not found for model \${modelName} (\${delegate})\`);\n    }\n    await prisma[delegate].deleteMany();\n  }\n}\n\nasync function insertData() {\n  for (const modelName of INSERT_ORDER) {\n    const delegate = modelToDelegate(modelName);\n    if (!prisma[delegate]) {\n      throw new Error(\`Delegate not found for model \${modelName} (\${delegate})\`);\n    }\n\n    const rows = (SEED_DATA[modelName] || []).map((row) => reviveRow(modelName, row));\n\n    if (!rows.length) {\n      console.log(\`- \${modelName}: 0 rows\`);\n      continue;\n    }\n\n    for (let i = 0; i < rows.length; i += BATCH_SIZE) {\n      const batch = rows.slice(i, i + BATCH_SIZE);\n      await prisma[delegate].createMany({ data: batch });\n    }\n\n    console.log(\`- \${modelName}: inserted \${rows.length} rows\`);\n  }\n}\n\nasync function main() {\n  console.log("🌱 Running snapshot seed...");\n  await clearData();\n  await insertData();\n  console.log("✅ Snapshot seed completed.");\n}\n\nmain()\n  .catch((error) => {\n    console.error("❌ Snapshot seed failed", error);\n    process.exitCode = 1;\n  })\n  .finally(async () => {\n    await prisma.$disconnect();\n  });\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const serviceDir = path.resolve(args["service-dir"] || process.cwd());
  const outPath = path.resolve(serviceDir, args.out || DEFAULT_OUTPUT);

  const serviceRequire = createRequire(path.join(serviceDir, "package.json"));
  const { PrismaClient, Prisma } = serviceRequire("@prisma/client");

  const prisma = new PrismaClient();

  const dmmfModels = Prisma.dmmf.datamodel.models;
  if (!Array.isArray(dmmfModels) || dmmfModels.length === 0) {
    throw new Error("No Prisma models found. Did you run prisma generate?");
  }

  const modelMetas = getModelMetas(dmmfModels);
  const metaByName = new Map(modelMetas.map((meta) => [meta.name, meta]));

  const insertOrder = sortModelsByDependencies(modelMetas);
  const deleteOrder = [...insertOrder].reverse();

  const seedData = {};
  const fieldTypes = {};

  console.log(`[seed-export] Service directory: ${serviceDir}`);
  console.log(`[seed-export] Models: ${insertOrder.join(", ")}`);

  for (const modelName of insertOrder) {
    const meta = metaByName.get(modelName);
    const delegate = meta.delegate;

    if (!prisma[delegate]) {
      throw new Error(`Delegate not found for model ${modelName} (${delegate})`);
    }

    const query = {};
    if (meta.orderByField) {
      query.orderBy = { [meta.orderByField]: "asc" };
    }

    const rows = await prisma[delegate].findMany(query);
    seedData[modelName] = rows.map((row) => serializeRow(row, meta.specialFieldTypes));

    if (Object.keys(meta.specialFieldTypes).length > 0) {
      fieldTypes[modelName] = meta.specialFieldTypes;
    }

    console.log(`[seed-export] ${modelName}: ${rows.length} rows`);
  }

  const generatedAt = new Date().toISOString();
  const sourceDbUrl = redactDatabaseUrl(process.env.DATABASE_URL);

  const content = renderSeedSnapshot({
    insertOrder,
    deleteOrder,
    fieldTypes,
    seedData,
    generatedAt,
    sourceDbUrl,
  });

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, content, "utf8");

  console.log(`[seed-export] Wrote snapshot seed: ${outPath}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("[seed-export] Failed:", error);
  process.exit(1);
});
