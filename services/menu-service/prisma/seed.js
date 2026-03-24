/* eslint-disable no-console */
const {
  PrismaClient,
  MealTemplateKind,
  MealItemRole,
  DayType,
} = require("@prisma/client");

const prisma = new PrismaClient();

const COACH_ID = "5ed57b28-caf4-4f78-bba5-bce43996ddfc";

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
   FOOD ITEMS
====================================================== */

async function seedFoodItems() {
  console.log("🥗 Seeding FoodItems...");

  const foods = [
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

  await prisma.foodItem.createMany({
    data: foods,
    skipDuplicates: true,
  });

  const all = await prisma.foodItem.findMany();
  console.log(`✅ ${all.length} FoodItems ready`);

  return new Map(all.map((f) => [f.name, f]));
}

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
  await prisma.vitaminMaster.createMany({ data: vitamins, skipDuplicates: true });
  console.log("✅ VitaminMaster ready");
}

/* ======================================================
   TEMPLATE MENUS
====================================================== */

async function seedTrainingMenu(foodMap) {
  console.log("📋 Seeding Training Menu...");

  const menu = await prisma.templateMenu.create({
    data: {
      coachId: COACH_ID,
      name: "יום העמסה",
      dayType: DayType.TRAINING,
      notes: "תפריט מועשר בפחמימות לאנרגיה זמינה",
      totalCalories: 0,
    },
  });

  const meal = await prisma.templateMenuMeal.create({
    data: { templateMenuId: menu.id, name: "ארוחת צהריים", totalCalories: 0 },
  });

  const proteinTemplate = await createMealTemplate({
    name: "חלבון לבחירה (אימון)",
    kind: MealTemplateKind.MEAT_MEAL,
    items: [
      { food: foodMap.get("חזה עוף"), grams: 200, role: MealItemRole.PROTEIN },
      { food: foodMap.get("פרגיות"), grams: 200, role: MealItemRole.PROTEIN },
    ],
  });

  const proteinCalories = calcTemplateCalories(proteinTemplate);
  await prisma.templateMenuMealOption.create({
    data: { mealId: meal.id, mealTemplateId: proteinTemplate.id, name: "עיקרית", orderIndex: 0 },
  });

  await prisma.templateMenuMeal.update({ where: { id: meal.id }, data: { totalCalories: proteinCalories } });
  await prisma.templateMenu.update({ where: { id: menu.id }, data: { totalCalories: proteinCalories } });
}

async function seedRestDayMenu(foodMap) {
  console.log("🛌 Seeding Rest Day Menu...");

  const menu = await prisma.templateMenu.create({
    data: {
      coachId: COACH_ID,
      name: "יום ללא העמסה",
      dayType: DayType.REST,
      notes: "תפריט דל פחמימה יחסית לשמירה על מאזן קלורי",
      totalCalories: 0,
    },
  });

  const meal = await prisma.templateMenuMeal.create({
    data: {
      templateMenuId: menu.id,
      name: "ארוחת בוקר",
      totalCalories: 0,
    },
  });

  const dairyTemplate = await createMealTemplate({
    name: "אופציות חלביות",
    kind: MealTemplateKind.DAIRY_MEAL,
    items: [
      { food: foodMap.get("משקה חלבון גו"), grams: 150, role: MealItemRole.PROTEIN },
      { food: foodMap.get("קוטג' 5%"), grams: 125, role: MealItemRole.PROTEIN },
    ],
  });

  const dairyCalories = calcTemplateCalories(dairyTemplate);

  await prisma.templateMenuMealOption.create({
    data: {
      mealId: meal.id,
      mealTemplateId: dairyTemplate.id,
      name: "חלבון בוקר",
      orderIndex: 0,
    },
  });

  await prisma.templateMenuMeal.update({
    where: { id: meal.id },
    data: { totalCalories: dairyCalories },
  });

  await prisma.templateMenu.update({
    where: { id: menu.id },
    data: { totalCalories: dairyCalories },
  });

  console.log("✅ Rest Day Menu ready");
}

/* ======================================================
   MAIN
====================================================== */

async function main() {
  try {
    await clearDb();
    const foodMap = await seedFoodItems();
    await seedVitamins();

    await seedTrainingMenu(foodMap);
    await seedRestDayMenu(foodMap);

    console.log("🌱 Seed completed successfully");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
