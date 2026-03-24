import { Prisma, PrismaClient } from "@prisma/client";
import { promises as fs } from "node:fs";
import * as path from "node:path";

const prisma = new PrismaClient();

type SeedFoodItem = Pick<
  Prisma.FoodItemCreateInput,
  "name" | "description" | "category" | "caloriesPer100g"
>;

const BATCH_SIZE = 100;
const HEBREW_CHAR_REGEX = /[\u0590-\u05ff]/;

const SOURCE_MODE = (process.env.FOOD_BULK_SOURCE ?? "auto").toLowerCase();
const DEFAULT_EXTERNAL_JSON_PATH = path.resolve(
  process.cwd(),
  "prisma/external_foods.json",
);

const OPEN_FOOD_FACTS_PAGE_SIZE = Number(
  process.env.OPEN_FOOD_FACTS_PAGE_SIZE ?? 100,
);
const OPEN_FOOD_FACTS_MAX_PAGES = Number(
  process.env.OPEN_FOOD_FACTS_MAX_PAGES ?? 20,
);
const OPEN_FOOD_FACTS_URL =
  process.env.OPEN_FOOD_FACTS_URL ??
  "https://world.openfoodfacts.org/cgi/search.pl";

// הרשימה הקיימת נשמרת כמו שהיא כדי לא לאבד נתונים שכבר הוגדרו במערכת.
const EXISTING_FOOD_ITEMS: ReadonlyArray<SeedFoodItem> = [
  // בשר ועוף
  { name: "קציצת המבורגר", category: "בשר", caloriesPer100g: 220 },
  { name: "סטייק אנטריקוט", category: "בשר", caloriesPer100g: 251 },
  { name: "צלעות", category: "בשר", caloriesPer100g: 350 },
  { name: "פרגיות", category: "בשר", caloriesPer100g: 160 },
  { name: "חזה עוף", category: "בשר", caloriesPer100g: 160 },
  { name: "פסטרמה עוף", category: "בשר מעובד", caloriesPer100g: 120 },
  { name: "שניצלים", category: "בשר מטוגן", caloriesPer100g: 220 },
  { name: "חזה הודו", category: "בשר", caloriesPer100g: 135 },
  { name: "קבב", category: "בשר", caloriesPer100g: 240 },
  { name: "רגל עוף", category: "בשר", caloriesPer100g: 143 },
  { name: "משולש עוף", category: "בשר", caloriesPer100g: 200 },
  { name: "שייטל", category: "בשר", caloriesPer100g: 170 },
  { name: "סינטה", category: "בשר", caloriesPer100g: 212 },
  { name: "אסאדו", category: "בשר", caloriesPer100g: 282 },

  // דגים וביצים
  { name: "דג טונה", category: "דגים", caloriesPer100g: 178 },
  { name: "טונה בשמן", category: "דגים", caloriesPer100g: 154 },
  { name: "ביצה", category: "ביצים", caloriesPer100g: 163 },

  // פחמימות ודגנים
  { name: "פיתה", category: "מאפה", caloriesPer100g: 240 },
  { name: "אורז", category: "דגנים", caloriesPer100g: 100 },
  { name: "פסטה", category: "דגנים", caloriesPer100g: 110 },
  { name: "קוסקוס", category: "דגנים", caloriesPer100g: 112 },
  { name: "פתיתים", category: "דגנים", caloriesPer100g: 110 },
  { name: "לחם פרוס", category: "מאפה", caloriesPer100g: 250 },
  { name: "טורטיה", category: "מאפה", caloriesPer100g: 293 },
  { name: "לחמנייה", category: "מאפה", caloriesPer100g: 266 },
  { name: "קרקרים", category: "מאפה", caloriesPer100g: 400 },
  { name: 'תפו"א', category: "שורש", caloriesPer100g: 88 },
  { name: "פיתה כוסמין", category: "מאפה", caloriesPer100g: 180 },
  { name: "בורגול", category: "דגנים", caloriesPer100g: 90 },
  { name: "פסטה בולונז", category: "דגנים", caloriesPer100g: 125 },
  { name: "חלה", category: "מאפה", caloriesPer100g: 300 },
  { name: "פרנה", category: "מאפה", caloriesPer100g: 240 },
  { name: "שעועית לבנה", category: "קטניות", caloriesPer100g: 139 },
  { name: "לחם מחמצת", category: "מאפה", caloriesPer100g: 289 },
  { name: "כוסמת", category: "דגנים", caloriesPer100g: 92 },
  { name: "חומוס גרגירים", category: "קטניות", caloriesPer100g: 164 },
  { name: "פול", category: "קטניות", caloriesPer100g: 110 },
  { name: "בטטה", category: "שורש", caloriesPer100g: 86 },
  { name: "שיבולת שועל", category: "דגנים", caloriesPer100g: 389 },

  // פירות וירקות
  { name: "מנגו", category: "פרי", caloriesPer100g: 65 },
  { name: "תותים", category: "פרי", caloriesPer100g: 33 },
  { name: "תפוח", category: "פרי", caloriesPer100g: 52 },
  { name: "בננה", category: "פרי", caloriesPer100g: 91 },
  { name: "אוכמניות", category: "פרי", caloriesPer100g: 57 },
  { name: "אבוקדו", category: "שומן", caloriesPer100g: 166 },
  { name: "לבבות דקל", category: "ירק", caloriesPer100g: 28 },
  { name: "מלפפון חמוץ", category: "ירק", caloriesPer100g: 11 },

  // מוצרי חלב ותוספים
  { name: "גבינה לבנה 1%", category: "גבינה", caloriesPer100g: 62 },
  { name: "קוטג' 1%", category: "גבינה", caloriesPer100g: 62 },
  { name: "גבינה לבנה 3%", category: "גבינה", caloriesPer100g: 76 },
  { name: "קוטג' 3%", category: "גבינה", caloriesPer100g: 76 },
  { name: "גבינה לבנה 5%", category: "גבינה", caloriesPer100g: 100 },
  { name: "קוטג' 5%", category: "גבינה", caloriesPer100g: 100 },
  { name: 'גבנ"ץ 9%', category: "גבינה צהובה", caloriesPer100g: 178 },
  { name: 'גבנ"ץ 28%', category: "גבינה צהובה", caloriesPer100g: 321 },
  { name: "חטיף חלבון", category: "חטיף", caloriesPer100g: 333 },
  { name: "אבקת חלבון", category: "משקה חלבון", caloriesPer100g: 400 },
  { name: "משקה חלבון גו", category: "משקה חלבון", caloriesPer100g: 53 },

  // שונות (שומנים, נשנושים, צ'יט)
  { name: "ספריי שמן", category: "שומן", caloriesPer100g: 884 },
  { name: "מיונז", category: "שומן", caloriesPer100g: 600 },
  { name: "סקיני פסטה", category: "תוספת", caloriesPer100g: 9 },
  { name: "חטיף אצות", category: "חטיף", caloriesPer100g: 500 },
  { name: "קינדר", category: "חטיף", caloriesPer100g: 555 },
  { name: "מסטיק", category: "חטיף", caloriesPer100g: 200 },
  { name: "וודקה אקסל טן", category: "אלכוהול", caloriesPer100g: 60 },

  // ג'אנק פוד
  { name: "המבורגר", category: "ג'אנק", caloriesPer100g: 333 },
  { name: "נאגטס", category: "ג'אנק", caloriesPer100g: 266 },
  { name: "חלה שניצל", category: "ג'אנק", caloriesPer100g: 233 },
  { name: "סושי", category: "ג'אנק", caloriesPer100g: 175 },
  { name: "עוגה", category: "מתוק", caloriesPer100g: 333 },
  { name: "לאפה שווארמה", category: "ג'אנק", caloriesPer100g: 266 },
  { name: "צ'יפס", category: "ג'אנק", caloriesPer100g: 233 },
  { name: "עראיס", category: "ג'אנק", caloriesPer100g: 333 },
  { name: "פיתה שווארמה", category: "ג'אנק", caloriesPer100g: 216 },
  { name: "משולש פיצה", category: "ג'אנק", caloriesPer100g: 250 },
  { name: "באגט שניצל", category: "ג'אנק", caloriesPer100g: 233 },
  { name: "פלאפל", category: "ג'אנק", caloriesPer100g: 200 },
  { name: "סושי מטוגן", category: "ג'אנק", caloriesPer100g: 227 },
  { name: "טורטיה משולשת", category: "ג'אנק", caloriesPer100g: 300 },
];

type RawObject = Record<string, unknown>;

function isObject(value: unknown): value is RawObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function hasHebrew(value: string): boolean {
  return HEBREW_CHAR_REGEX.test(value);
}

function toStringValue(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = normalizeText(value);
  return normalized.length > 0 ? normalized : null;
}

function toNumberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    const str = toStringValue(value);
    if (str) return str;
  }
  return null;
}

function firstNumber(...values: unknown[]): number | null {
  for (const value of values) {
    const num = toNumberValue(value);
    if (num !== null) return num;
  }
  return null;
}

function getNutrimentsEnergyKcal100g(record: RawObject): number | null {
  const nutriments = record.nutriments;
  if (!isObject(nutriments)) return null;
  return firstNumber(
    nutriments["energy-kcal_100g"],
    nutriments["energy-kcal_value"],
    nutriments["energy-kcal"],
  );
}

function normalizeRecordToFoodItem(record: RawObject): SeedFoodItem | null {
  const name = firstString(
    record.name,
    record.product_name_he,
    record.product_name,
    record.shmmitzrach,
    record["SHM MITBASH"],
  );

  if (!name || !hasHebrew(name)) return null;

  const caloriesRaw = firstNumber(
    record.caloriesPer100g,
    record.calories,
    record.food_energy,
    record["KCAL"],
    record["energy-kcal_100g"],
    getNutrimentsEnergyKcal100g(record),
  );

  if (caloriesRaw === null || caloriesRaw < 0) return null;

  const categoryCandidate = firstString(
    record.category,
    record.category_he,
    record["SUG"],
    record.categories,
  );
  const category = categoryCandidate && hasHebrew(categoryCandidate)
    ? normalizeText(categoryCandidate.split(",")[0] ?? categoryCandidate)
    : "כללי";

  const descriptionCandidate = firstString(
    record.description,
    record.description_he,
    record.product_description,
    record.product_description_he,
  );
  const description = descriptionCandidate && hasHebrew(descriptionCandidate)
    ? descriptionCandidate
    : null;

  const caloriesPer100g = Number(caloriesRaw.toFixed(2));

  if (!Number.isFinite(caloriesPer100g)) return null;

  return {
    name,
    description,
    category,
    caloriesPer100g,
  };
}

function extractRawRecords(payload: unknown): RawObject[] {
  if (Array.isArray(payload)) {
    return payload.filter(isObject);
  }

  if (!isObject(payload)) return [];

  const candidateKeys = [
    "foods",
    "items",
    "products",
    "records",
    "data",
    "result",
  ];

  for (const key of candidateKeys) {
    const value = payload[key];
    if (Array.isArray(value)) return value.filter(isObject);

    if (isObject(value) && Array.isArray(value.records)) {
      return value.records.filter(isObject);
    }
  }

  return [];
}

async function loadFoodsFromJson(
  jsonPath: string,
  strict: boolean,
): Promise<SeedFoodItem[]> {
  try {
    const fileContent = await fs.readFile(jsonPath, "utf8");
    const parsed = JSON.parse(fileContent) as unknown;
    const rawRecords = extractRawRecords(parsed);

    let skipped = 0;
    const foods = rawRecords.flatMap((record) => {
      const normalized = normalizeRecordToFoodItem(record);
      if (!normalized) {
        skipped += 1;
        return [];
      }
      return [normalized];
    });

    console.log(
      `📥 JSON items loaded: ${foods.length} (skipped: ${skipped}) from ${jsonPath}`,
    );

    return foods;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT" && !strict) {
      console.log(`ℹ️ JSON source not found (${jsonPath}), continuing without it`);
      return [];
    }

    throw new Error(
      `Failed to load JSON source (${jsonPath}): ${(error as Error).message}`,
    );
  }
}

type OpenFoodFactsResponse = {
  products?: unknown[];
  count?: number;
};

function buildOpenFoodFactsUrl(page: number): string {
  const url = new URL(OPEN_FOOD_FACTS_URL);
  url.searchParams.set("action", "process");
  url.searchParams.set("json", "1");
  url.searchParams.set("page_size", String(OPEN_FOOD_FACTS_PAGE_SIZE));
  url.searchParams.set("page", String(page));
  url.searchParams.set("tagtype_0", "countries");
  url.searchParams.set("tag_contains_0", "contains");
  url.searchParams.set("tag_0", "israel");
  url.searchParams.set(
    "fields",
    "product_name,product_name_he,categories,energy-kcal_100g,nutriments",
  );
  return url.toString();
}

async function fetchOpenFoodFactsIsraelFoods(): Promise<SeedFoodItem[]> {
  if (typeof fetch !== "function") {
    throw new Error(
      "Global fetch is not available. Use Node.js 18+ or configure JSON import mode.",
    );
  }

  const collected: SeedFoodItem[] = [];
  let skipped = 0;

  for (let page = 1; page <= OPEN_FOOD_FACTS_MAX_PAGES; page += 1) {
    const url = buildOpenFoodFactsUrl(page);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Nutri-Voice-Seed/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Open Food Facts request failed (HTTP ${response.status}) on page ${page}`,
      );
    }

    const payload = (await response.json()) as OpenFoodFactsResponse;
    const products = Array.isArray(payload.products) ? payload.products : [];

    if (products.length === 0) {
      break;
    }

    for (const product of products) {
      if (!isObject(product)) {
        skipped += 1;
        continue;
      }

      const normalized = normalizeRecordToFoodItem(product);
      if (!normalized) {
        skipped += 1;
        continue;
      }
      collected.push(normalized);
    }

    const totalCount =
      typeof payload.count === "number" && payload.count > 0
        ? payload.count
        : null;
    if (
      totalCount &&
      page * OPEN_FOOD_FACTS_PAGE_SIZE >= totalCount
    ) {
      break;
    }
  }

  console.log(
    `📥 Open Food Facts items fetched: ${collected.length} (skipped: ${skipped})`,
  );

  return collected;
}

function mergeFoodQueues(...queues: ReadonlyArray<SeedFoodItem>[]): SeedFoodItem[] {
  const byName = new Map<string, SeedFoodItem>();

  for (const queue of queues) {
    for (const item of queue) {
      const key = normalizeText(item.name);
      if (!byName.has(key)) {
        byName.set(key, item);
      }
    }
  }

  return Array.from(byName.values());
}

function chunk<T>(items: ReadonlyArray<T>, size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function assertFoodNameIsUniqueKey() {
  const foodModel = Prisma.dmmf.datamodel.models.find(
    (model) => model.name === "FoodItem",
  );
  const nameField = foodModel?.fields.find((field) => field.name === "name");

  if (!nameField?.isUnique) {
    throw new Error(
      "FoodItem.name חייב להיות @unique ב-schema.prisma כדי ש-upsert לפי שם יעבוד.",
    );
  }
}

async function upsertFoodsInBatches(items: ReadonlyArray<SeedFoodItem>) {
  const batches = chunk(items, BATCH_SIZE);

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index];

    await prisma.$transaction(
      batch.map((item) =>
        prisma.foodItem.upsert({
          where: { name: item.name } as Prisma.FoodItemWhereUniqueInput,
          update: {},
          create: {
            name: item.name,
            description: item.description ?? null,
            category: item.category,
            caloriesPer100g: item.caloriesPer100g,
          },
        }),
      ),
    );

    console.log(
      `✅ Batch ${index + 1}/${batches.length} completed (${batch.length} items)`,
    );
  }
}

async function loadBulkItems(jsonPath: string): Promise<{
  jsonItems: SeedFoodItem[];
  apiItems: SeedFoodItem[];
}> {
  if (SOURCE_MODE === "json") {
    return {
      jsonItems: await loadFoodsFromJson(jsonPath, true),
      apiItems: [],
    };
  }

  if (SOURCE_MODE === "open-food-facts") {
    return {
      jsonItems: [],
      apiItems: await fetchOpenFoodFactsIsraelFoods(),
    };
  }

  if (SOURCE_MODE === "both") {
    return {
      jsonItems: await loadFoodsFromJson(jsonPath, false),
      apiItems: await fetchOpenFoodFactsIsraelFoods(),
    };
  }

  // auto: קודם JSON, ואם אין נתונים אז Open Food Facts.
  const jsonItems = await loadFoodsFromJson(jsonPath, false);
  if (jsonItems.length > 0) {
    return { jsonItems, apiItems: [] };
  }

  return {
    jsonItems: [],
    apiItems: await fetchOpenFoodFactsIsraelFoods(),
  };
}

async function main() {
  const externalJsonPath = process.env.EXTERNAL_FOODS_JSON_PATH
    ? path.resolve(process.cwd(), process.env.EXTERNAL_FOODS_JSON_PATH)
    : DEFAULT_EXTERNAL_JSON_PATH;

  console.log("🌱 Starting food seed (upsert by name, no deletes)...");
  console.log(`📌 Source mode: ${SOURCE_MODE}`);
  assertFoodNameIsUniqueKey();

  const { jsonItems, apiItems } = await loadBulkItems(externalJsonPath);
  const mergedQueue = mergeFoodQueues(EXISTING_FOOD_ITEMS, jsonItems, apiItems);

  console.log(
    [
      `📦 Queue size: ${mergedQueue.length}`,
      `  existing=${EXISTING_FOOD_ITEMS.length}`,
      `  json=${jsonItems.length}`,
      `  api=${apiItems.length}`,
    ].join("\n"),
  );

  await upsertFoodsInBatches(mergedQueue);

  const total = await prisma.foodItem.count();
  console.log(`✅ Seed completed. Total FoodItem rows in DB: ${total}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
