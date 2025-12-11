// ===== Import all DTOs (CommonJS → ES) =====
import * as Idm from "../dto/idm.dto.js";
import * as Menu from "../dto/menu.dto.js";
import * as Tracking from "../dto/tracking.dto.js";
import * as Workout from "../dto/workout.dto.js";

function unwrap(zodSchema) {
  let current = zodSchema;
  let nullable = false;
  let optional = false;

  while (current?._def?.type === "optional" || current?._def?.type === "nullable" || current?._def?.type === "nullish") {
    if (current._def.type === "optional" || current._def.type === "nullish") optional = true;
    if (current._def.type === "nullable" || current._def.type === "nullish") nullable = true;

    current = current._def.innerType;
  }

  return { base: current, nullable, optional };
}

function buildSchema(zodSchema) {
  const { base, nullable, optional } = unwrap(zodSchema);
  const def = base?._def || base?.def;

  if (!def) return { schema: { type: "object" }, required: !optional };

  let schema;

  switch (def.type) {
    case "object": {
      const properties = {};
      const required = [];
      const shape = typeof def.shape === "function" ? def.shape() : def.shape || {};

      for (const [key, child] of Object.entries(shape)) {
        const childSchema = buildSchema(child);

        if (childSchema.schema) properties[key] = childSchema.schema;
        if (childSchema.required) required.push(key);
      }

      schema = { type: "object", properties };
      if (required.length) schema.required = required;
      break;
    }
    case "string": {
      schema = { type: "string" };
      const format = def.checks?.find((c) => c?.format)?.format;
      if (format) schema.format = format;
      break;
    }
    case "number": {
      const isInt = def.checks?.some((c) => c?.isInt);
      schema = { type: isInt ? "integer" : "number" };
      break;
    }
    case "boolean": {
      schema = { type: "boolean" };
      break;
    }
    case "array": {
      const itemSchema = buildSchema(def.element).schema;
      schema = { type: "array", items: itemSchema || { type: "object" } };
      break;
    }
    case "enum": {
      schema = { type: "string", enum: Object.values(def.entries) };
      break;
    }
    case "any": {
      schema = {};
      break;
    }
    default: {
      schema = { type: "object" };
    }
  }

  if (nullable) schema = { ...schema, nullable: true };

  return { schema, required: !optional };
}

/**
 * Extract all Zod schemas from a DTO module
 * - Only exports that have .safeParse (i.e., are Zod schemas)
 */
function extractSchemas(dtoModule) {
  const out = {};

  for (const [name, schema] of Object.entries(dtoModule)) {
    if (schema && typeof schema.safeParse === "function") {
      const { schema: jsonSchema } = buildSchema(schema);

      out[name] = jsonSchema || { type: "object" };
    }
  }

  return out;
}

// ===== Convert all schema groups =====
const idmSchemas = extractSchemas(Idm);
const menuSchemas = extractSchemas(Menu);
const trackingSchemas = extractSchemas(Tracking);
const workoutSchemas = extractSchemas(Workout);


// ===== Combined registry (used by Swagger) =====
export const zodSchemas = {
  ...idmSchemas,
  ...menuSchemas,
  ...trackingSchemas,
  ...workoutSchemas,
};
console.log("[ZOD-SCHEMAS] Loaded schemas keys:", Object.keys(zodSchemas));
console.log("[ZOD-SCHEMAS] Total schemas loaded:", Object.keys(zodSchemas).length);