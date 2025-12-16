/* eslint-disable no-console */
const {
  PrismaClient,
  MealTemplateKind,
  MealItemRole,
  DayType,
} = require("@prisma/client");

const prisma = new PrismaClient();

const COACH_ID = "ba59ccee-bd43-4102-acb8-fd11184c2bad";

/* ======================================================
   HELPERS
====================================================== */

function calcCalories(calPer100g, grams) {
  return Math.round((calPer100g * grams) / 100);
}

async function clearDb() {
  console.log("🧹 Clearing DB...");

  await prisma.clientMenuMealOptionItem.deleteMany();
  await prisma.clientMenuMealOption.deleteMany();
  await prisma.clientMenuMeal.deleteMany();
  await prisma.clientMenuVitamin.deleteMany();
  await prisma.clientMenu.deleteMany();

  await prisma.templateMenuMealOption.deleteMany();
  await prisma.templateMenuMeal.deleteMany();
  await prisma.templateMenuVitamin.deleteMany();
  await prisma.templateMenu.deleteMany();

  await prisma.mealTemplateItem.deleteMany();
  await prisma.mealTemplate.deleteMany();

  await prisma.foodItem.deleteMany();
  await prisma.vitaminMaster.deleteMany();

  console.log("✅ DB cleared");
}

async function createMealTemplate({ name, kind, items }) {
  return prisma.mealTemplate.create({
    data: {
      name,
      kind,
      coachId: COACH_ID,
      items: {
        create: items.map((it) => ({
          foodItemId: it.food.id,
          grams: it.grams ?? 100,
          role: it.role,
        })),
      },
    },
    include: {
      items: { include: { foodItem: true } },
    },
  });
}

function calcTemplateCalories(template) {
  return template.items.reduce(
    (sum, it) =>
      sum + calcCalories(it.foodItem.caloriesPer100g, it.grams),
    0
  );
}

/* ======================================================
   FOOD ITEMS (מורחב כמו במקור)
====================================================== */

async function seedFoodItems() {
  console.log("🥗 Seeding FoodItems...");

  const foods = [
    // בשר / דגים
    { name: "חזה עוף", category: "בשר", caloriesPer100g: 160 },
    { name: "פרגיות", category: "בשר", caloriesPer100g: 200 },
    { name: "כבד עוף", category: "בשר", caloriesPer100g: 165 },
    { name: "פסטרמה עוף", category: "בשר מעובד", caloriesPer100g: 110 },
    { name: "שניצלים", category: "בשר מטוגן", caloriesPer100g: 250 },
    { name: "חזה הודו", category: "בשר", caloriesPer100g: 135 },
    { name: "סלמון אפוי", category: "דגים", caloriesPer100g: 200 },
    { name: "לברק אפוי", category: "דגים", caloriesPer100g: 190 },
    { name: "טונה בשמן", category: "דגים", caloriesPer100g: 180 },

    // חלבון / חלב
    { name: "מעדן פרו", category: "מעדן חלבון", caloriesPer100g: 70 },
    { name: "קוטג 1%", category: "גבינה", caloriesPer100g: 80 },
    { name: "קוטג 5%", category: "גבינה", caloriesPer100g: 120 },
    { name: "גבינה לבנה 3%", category: "גבינה", caloriesPer100g: 90 },
    { name: 'גבן"ץ 9%', category: "גבינה צהובה", caloriesPer100g: 260 },
    { name: "ביצים", category: "ביצים", caloriesPer100g: 155 },
    { name: "חטיף חלבון", category: "חטיף", caloriesPer100g: 350 },
    { name: "משקה חלבון", category: "משקה חלבון", caloriesPer100g: 60 },

    // פחמימות
    { name: "פיתה לבנה", category: "מאפה", caloriesPer100g: 260 },
    { name: "לחם פרוס", category: "מאפה", caloriesPer100g: 250 },
    { name: "אורז לבן מבושל", category: "דגנים", caloriesPer100g: 130 },
    { name: "פסטה מבושלת", category: "דגנים", caloriesPer100g: 160 },
    { name: "קוסקוס מבושל", category: "דגנים", caloriesPer100g: 112 },
    { name: "תפוח אדמה מבושל", category: "שורש", caloriesPer100g: 87 },

    // חופש / נפשי
    { name: "משולש פיצה", category: "ג'אנק", caloriesPer100g: 280 },
    { name: "נאגטס", category: "ג'אנק", caloriesPer100g: 280 },
    { name: "המבורגר", category: "ג'אנק", caloriesPer100g: 250 },
    { name: "צ'יפס", category: "ג'אנק", caloriesPer100g: 320 },
    { name: "מסטיק", category: "חטיף", caloriesPer100g: 300 },
  ];

  await prisma.foodItem.createMany({
    data: foods,
    skipDuplicates: true,
  });

  const all = await prisma.foodItem.findMany();
  console.log(`✅ ${all.length} FoodItems ready`);

  return new Map(all.map((f) => [f.name, f]));
}

/* ======================================================
   VITAMINS (מורחב כמו במקור)
====================================================== */

async function seedVitamins() {
  console.log("💊 Seeding VitaminMaster...");

  const vitamins = [
    { name: "ויטמין A", description: "ראייה, עור וחיסון" },
    { name: "ויטמין C", description: "נוגד חמצון" },
    { name: "ויטמין D", description: "בריאות עצם" },
    { name: "ברזל", description: "הובלת חמצן" },
    { name: "מגנזיום", description: "שרירים והרפיה" },
    { name: "אומגה 3", description: "בריאות הלב" },
    { name: "מולטי ויטמין", description: "תוסף יומי" },
  ];

  await prisma.vitaminMaster.createMany({
    data: vitamins,
    skipDuplicates: true,
  });

  console.log("✅ VitaminMaster ready");
}

/* ======================================================
   TEMPLATE MENU
====================================================== */

async function seedTemplateMenus(foodMap) {
  console.log("📋 Seeding TemplateMenu...");

  const menu = await prisma.templateMenu.create({
    data: {
      coachId: COACH_ID,
      name: "תפריט יום אימון",
      dayType: DayType.TRAINING,
      notes: "תפריט לדוגמה עם חלבון ופחמימה",
      totalCalories: 0,
    },
  });

  await prisma.templateMenuVitamin.create({
    data: {
      templateMenuId: menu.id,
      name: "אומגה 3",
      description: "2 קפסולות אחרי ארוחה",
    },
  });

  const meal = await prisma.templateMenuMeal.create({
    data: {
      templateMenuId: menu.id,
      name: "ארוחה 1",
      totalCalories: 0,
    },
  });

  const proteinTemplate = await createMealTemplate({
    name: "בחירת חלבון",
    kind: MealTemplateKind.MEAT_MEAL,
    items: [
      { food: foodMap.get("חזה עוף"), grams: 200, role: MealItemRole.PROTEIN },
      { food: foodMap.get("פרגיות"), grams: 200, role: MealItemRole.PROTEIN },
      { food: foodMap.get("סלמון אפוי"), grams: 180, role: MealItemRole.PROTEIN },
    ],
  });

  const proteinCalories = calcTemplateCalories(proteinTemplate);

  await prisma.templateMenuMealOption.create({
    data: {
      mealId: meal.id,
      mealTemplateId: proteinTemplate.id,
      name: "אופציית חלבון",
      orderIndex: 0,
    },
  });

  await prisma.templateMenuMeal.update({
    where: { id: meal.id },
    data: { totalCalories: proteinCalories },
  });

  await prisma.templateMenu.update({
    where: { id: menu.id },
    data: { totalCalories: proteinCalories },
  });

  console.log("✅ TemplateMenu ready");
}

/* ======================================================
   MAIN
====================================================== */

async function main() {
  try {
    await clearDb();
    const foodMap = await seedFoodItems();
    await seedVitamins();
    await seedTemplateMenus(foodMap);
    console.log("🌱 Seed completed successfully");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
