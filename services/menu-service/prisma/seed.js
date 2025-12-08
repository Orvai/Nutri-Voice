/* eslint-disable no-console */
const {
  PrismaClient,
  MealTemplateKind,
  MealItemRole,
  DayType,
} = require("@prisma/client");

const prisma = new PrismaClient();

// שים כאן את ה-coachId שלך אם יש אמיתי במערכת
const COACH_ID = "ba59ccee-bd43-4102-acb8-fd11184c2bad";


// ==================== HELPERS ====================

async function clearDb() {
  console.log("🧹 Clearing existing data...");

  // סדר מחיקה לפי תלות
  await prisma.clientMenuMealItem.deleteMany();
  await prisma.clientMenuMealOption.deleteMany();
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

// חישוב קלוריות לפי 100 גרם
function calcCalories(calPer100g, grams) {
  if (!calPer100g || !grams) return 0;
  return Math.round((calPer100g * grams) / 100);
}

// יצירת MealTemplate + items שלו
async function createMealTemplate({ name, kind, coachId, items }) {
  // items: [{ food, grams, role, notes? }]
  let totalCalories = 0;

  const mt = await prisma.mealTemplate.create({
    data: {
      name,
      kind,
      coachId,
      totalCalories: 0,
    },
  });

  for (const item of items) {
    const grams = item.grams ?? 100;
    const defaultCalories = calcCalories(item.food.caloriesPer100g, grams);
    totalCalories += defaultCalories;

    await prisma.mealTemplateItem.create({
      data: {
        foodItemId: item.food.id,
        mealTemplateId: mt.id,
        role: item.role,
        defaultGrams: grams,
        defaultCalories,
        notes: item.notes ?? null,
      },
    });
  }

  const updated = await prisma.mealTemplate.update({
    where: { id: mt.id },
    data: { totalCalories },
  });

  return updated;
}

// ==================== SEED: FOOD & VITAMINS ====================

async function seedFoodItems() {
  console.log("🥗 Creating FoodItems...");

  // כל הערכים לפי 100 גרם
  const foodsData = [
    // חלבון בשרי
    { name: "חזה עוף", category: "בשר", caloriesPer100g: 160, proteinPer100g: 31 },
    { name: "פרגיות", category: "בשר", caloriesPer100g: 200, proteinPer100g: 27 },
    { name: "כבד עוף", category: "בשר", caloriesPer100g: 165, proteinPer100g: 25 },
    { name: "פסטרמה עוף", category: "בשר מעובד", caloriesPer100g: 110, proteinPer100g: 20 },
    { name: "שניצלים", category: "בשר מטוגן", caloriesPer100g: 250, proteinPer100g: 18 },
    { name: "חזה הודו", category: "בשר", caloriesPer100g: 135, proteinPer100g: 29 },
    { name: "כבד בקר", category: "בשר", caloriesPer100g: 180, proteinPer100g: 27 },
    { name: "קציצות בקר", category: "בשר", caloriesPer100g: 220, proteinPer100g: 20 },
    { name: "קבב", category: "בשר", caloriesPer100g: 250, proteinPer100g: 22 },
    { name: "רגל עוף", category: "בשר", caloriesPer100g: 200, proteinPer100g: 22 },
    { name: "משולש עוף", category: "בשר", caloriesPer100g: 210, proteinPer100g: 22 },

    // דגים
    { name: "סלמון אפוי", category: "דגים", caloriesPer100g: 200, proteinPer100g: 22 },
    { name: "לברק אפוי", category: "דגים", caloriesPer100g: 190, proteinPer100g: 24 },
    { name: "דג טונה", category: "דגים", caloriesPer100g: 130, proteinPer100g: 29 },
    { name: "טונה בשמן", category: "דגים", caloriesPer100g: 180, proteinPer100g: 25 },

    // חלב / גבינות
    { name: "מעדן פרו", category: "מעדן חלבון", caloriesPer100g: 70, proteinPer100g: 10 },
    { name: "קוטג 1%", category: "גבינה", caloriesPer100g: 80, proteinPer100g: 11 },
    { name: "קוטג 3%", category: "גבינה", caloriesPer100g: 100, proteinPer100g: 11 },
    { name: "קוטג 5%", category: "גבינה", caloriesPer100g: 120, proteinPer100g: 10 },
    { name: "גבינה לבנה 1%", category: "גבינה", caloriesPer100g: 70, proteinPer100g: 10 },
    { name: "גבינה לבנה 3%", category: "גבינה", caloriesPer100g: 90, proteinPer100g: 10 },
    { name: "גבינה לבנה 5%", category: "גבינה", caloriesPer100g: 120, proteinPer100g: 11 },
    { name: "גבן\"ץ 9%", category: "גבינה צהובה", caloriesPer100g: 260, proteinPer100g: 30 },
    { name: "גבן\"ץ 28%", category: "גבינה צהובה", caloriesPer100g: 350, proteinPer100g: 25 },

    // ביצים / חטיפים
    { name: "ביצים", category: "ביצים", caloriesPer100g: 155, proteinPer100g: 13 },
    { name: "חטיף חלבון", category: "חטיף", caloriesPer100g: 350, proteinPer100g: 30 },
    { name: "משקה חלבון 0%", category: "משקה חלבון", caloriesPer100g: 60, proteinPer100g: 8 },
    { name: "משקה חלבון 42 גרם", category: "משקה חלבון", caloriesPer100g: 90, proteinPer100g: 10 },

    // פחמימות - בסיס
    { name: "פיתה לבנה", category: "מאפה", caloriesPer100g: 260, proteinPer100g: 9 },
    { name: "פיתה כוסמין", category: "מאפה", caloriesPer100g: 250, proteinPer100g: 10 },
    { name: "לחם פרוס", category: "מאפה", caloriesPer100g: 250, proteinPer100g: 8 },
    { name: "לחמנייה", category: "מאפה", caloriesPer100g: 270, proteinPer100g: 8 },
    { name: "טורטיה", category: "מאפה", caloriesPer100g: 280, proteinPer100g: 8 },

    { name: "אורז לבן מבושל", category: "דגנים", caloriesPer100g: 130, proteinPer100g: 2.5 },
    { name: "פסטה מבושלת", category: "דגנים", caloriesPer100g: 160, proteinPer100g: 5.5 },
    { name: "קוסקוס מבושל", category: "דגנים", caloriesPer100g: 112, proteinPer100g: 3.8 },
    { name: "פתיתים מבושלים", category: "דגנים", caloriesPer100g: 160, proteinPer100g: 5 },
    { name: "פסטה בולונז", category: "מנה משולבת", caloriesPer100g: 250, proteinPer100g: 10 },
    { name: "תפוח אדמה מבושל", category: "שורש", caloriesPer100g: 87, proteinPer100g: 2 },

    // פחמימות / נפש (ג'אנק / העמסת פחמימות)
    { name: "משולש פיצה", category: "ג'אנק", caloriesPer100g: 280, proteinPer100g: 12 },
    { name: "נאגטס", category: "ג'אנק", caloriesPer100g: 280, proteinPer100g: 15 },
    { name: "חלה", category: "מאפה", caloriesPer100g: 280, proteinPer100g: 8 },
    { name: "המבורגר", category: "ג'אנק", caloriesPer100g: 250, proteinPer100g: 15 },
    { name: "סושי", category: "מנה אסייתית", caloriesPer100g: 140, proteinPer100g: 5 },
    { name: "מקסיקני כפול", category: "טורטיה", caloriesPer100g: 250, proteinPer100g: 12 },
    { name: "צ'יפס", category: "ג'אנק", caloriesPer100g: 320, proteinPer100g: 3.5 },
    { name: "פיתה שווארמה", category: "ג'אנק", caloriesPer100g: 350, proteinPer100g: 15 },
    { name: "אלכוהול - בירה", category: "משקה אלכוהולי", caloriesPer100g: 43, proteinPer100g: 0.5 },

    // שומנים / בריאות
    { name: "טחינה גולמית", category: "שומנים", caloriesPer100g: 595, proteinPer100g: 17 },
    { name: "אבוקדו", category: "שומנים", caloriesPer100g: 160, proteinPer100g: 2 },

    // צמחוני / טבעוני
    { name: "עדשים מבושלות", category: "קטניות", caloriesPer100g: 116, proteinPer100g: 9 },
    { name: "טופו", category: "קטניות", caloriesPer100g: 76, proteinPer100g: 8 },

    // חטיפים / Free
    { name: "מסטיק", category: "חטיף", caloriesPer100g: 300, proteinPer100g: 0 },
    { name: "שוקולד חלב", category: "חטיף", caloriesPer100g: 535, proteinPer100g: 7 },
    { name: "במבה", category: "חטיף", caloriesPer100g: 550, proteinPer100g: 16 },
    { name: "גלידת וניל", category: "קינוח", caloriesPer100g: 200, proteinPer100g: 3 },
  ];

  await prisma.foodItem.createMany({
    data: foodsData,
    skipDuplicates: true,
  });

  const created = await prisma.foodItem.findMany();

  console.log(`✅ Created/kept ${created.length} FoodItems`);

  const map = new Map();
  for (const food of created) {
    map.set(food.name, food);
  }

  return map;
}

async function seedVitamins() {
  console.log("💊 Creating VitaminMaster...");

  const vitamins = [
    { name: "ויטמין A", description: "ראייה, עור ומערכת חיסון" },
    { name: "ויטמין C", description: "נוגד חמצון, קולגן, חיסון" },
    { name: "ויטמין D", description: "ספיגת סידן ובריאות עצם" },
    { name: "ברזל", description: "הובלת חמצן בדם" },
    { name: "מגנזיום", description: "שרירים, עצבים, הרפיה" },
    { name: "מולטי ויטמין", description: "קומבינציית ויטמינים יומית" },
    { name: "אומגה 3", description: "בריאות לב וכלי דם" },
  ];

  await prisma.vitaminMaster.createMany({
    data: vitamins,
    skipDuplicates: true,
  });

  const all = await prisma.vitaminMaster.findMany();
  console.log(`✅ Created/kept ${all.length} VitaminMaster records`);

  const map = new Map();
  for (const v of all) map.set(v.name, v);
  return map;
}

// ==================== SEED TEMPLATE MENUS ====================

async function seedTemplateMenus(foodMap) {
  console.log("📋 Creating TemplateMenus...");

  const templatesData = [
    // ========== תפריט יום מנוחה ==========
    {
      name: "תפריט יום מנוחה",
      dayType: DayType.REST,
      notes:
        'תפריט יום ללא אימון. בכל ארוחה ~300 קק"ל מהחלבון. ניתן להוסיף ירקות ירוקים (30–60 קק"ל).',
      vitamins: [
        {
          name: "מולטי ויטמין",
          description: "פעם ביום, עדיפות אחרי ארוחה",
        },
      ],
      meals: [
        {
          name: "קלוריות חופשיות",
          options: [
            {
              name: "כל מאכל העולה על רוחך (עד 100 קק\"ל)",
              kind: MealTemplateKind.FREE_CALORIES,
              items: [
                {
                  food: foodMap.get("מסטיק"),
                  grams: 5,
                  role: MealItemRole.FREE,
                  notes: "דוגמה לחטיף קטן",
                },
              ],
            },
          ],
        },

        // ========= FIX: איחוד כל מוצרי החלבון לאופציה אחת =========
        {
          name: "ארוחה 1 - חלבון",
          options: [
            {
              name: "בחירת חלבון חופשית",
              kind: MealTemplateKind.MEAT_MEAL,
              items: [
                { food: foodMap.get("חזה עוף"), grams: 200, role: MealItemRole.PROTEIN },
                { food: foodMap.get("פרגיות"), grams: 200, role: MealItemRole.PROTEIN },
                { food: foodMap.get("כבד עוף"), grams: 200, role: MealItemRole.PROTEIN },
                { food: foodMap.get("פסטרמה עוף"), grams: 150, role: MealItemRole.PROTEIN },
                { food: foodMap.get("סלמון אפוי"), grams: 200, role: MealItemRole.PROTEIN },
                { food: foodMap.get("לברק אפוי"), grams: 200, role: MealItemRole.PROTEIN },
                { food: foodMap.get("דג טונה"), grams: 200, role: MealItemRole.PROTEIN },
              ],
            },
          ],
        },

        // ========= FIX: איחוד מוצרי פחמימה =========
        {
          name: "ארוחה 1 - פחמימה",
          options: [
            {
              name: "בחירת פחמימה חופשית",
              kind: MealTemplateKind.MEAT_MEAL,
              items: [
                { food: foodMap.get("פיתה לבנה"), grams: 100, role: MealItemRole.CARB },
                { food: foodMap.get("אורז לבן מבושל"), grams: 160, role: MealItemRole.CARB },
                { food: foodMap.get("תפוח אדמה מבושל"), grams: 200, role: MealItemRole.CARB },
                { food: foodMap.get("פסטה מבושלת"), grams: 160, role: MealItemRole.CARB },
                { food: foodMap.get("לחם פרוס"), grams: 80, role: MealItemRole.CARB, notes: "2 פרוסות" },
              ],
            },
          ],
        },

        // ========= FIX: איחוד מוצרי חלבון לארוחה השנייה =========
        {
          name: "ארוחה 2 - חלבון",
          options: [
            {
              name: "בחירת חלבון חלבית",
              kind: MealTemplateKind.DAIRY_MEAL,
              items: [
                { food: foodMap.get("מעדן פרו"), grams: 150, role: MealItemRole.PROTEIN },
                { food: foodMap.get("קוטג 1%"), grams: 200, role: MealItemRole.PROTEIN },
                { food: foodMap.get("ביצים"), grams: 200, role: MealItemRole.PROTEIN },
                { food: foodMap.get("טונה בשמן"), grams: 100, role: MealItemRole.PROTEIN },
                { food: foodMap.get("משקה חלבון 0%"), grams: 300, role: MealItemRole.PROTEIN },
              ],
            },
          ],
        },
      ],
    },
    // ========== תפריט יום אימון ==========
    {
      name: "תפריט יום אימון",
      dayType: DayType.TRAINING,
      notes:
        "יום אימון כפול. ארוחה 1 חלבון, ארוחה 2 העמסת פחמימות (אופציית בריאות / בריאות הנפש).",
      vitamins: [
        {
          name: "אומגה 3",
          description: "2 קפסולות אחרי ארוחה 2",
        },
      ],
      meals: [
        {
          name: "ארוחה 1 - בחר אופציית חלבון",
          options: [
            {
              name: "אופציה חלבית",
              kind: MealTemplateKind.DAIRY_MEAL,
              items: [
                { food: foodMap.get("מעדן פרו"), grams: 150, role: MealItemRole.PROTEIN },
                { food: foodMap.get("קוטג 1%"), grams: 200, role: MealItemRole.PROTEIN },
                { food: foodMap.get("גבינה לבנה 1%"), grams: 200, role: MealItemRole.PROTEIN },
                { food: foodMap.get("חטיף חלבון"), grams: 60, role: MealItemRole.PROTEIN },
                { food: foodMap.get("ביצים"), grams: 200, role: MealItemRole.PROTEIN },
                { food: foodMap.get("טונה בשמן"), grams: 100, role: MealItemRole.PROTEIN },
                { food: foodMap.get("גבן\"ץ 9%"), grams: 50, role: MealItemRole.PROTEIN },
                { food: foodMap.get("משקה חלבון 42 גרם"), grams: 330, role: MealItemRole.PROTEIN },
              ],
            },
            {
              name: "אופציה בשרית",
              kind: MealTemplateKind.MEAT_MEAL,
              items: [
                { food: foodMap.get("חזה עוף"), grams: 200, role: MealItemRole.PROTEIN },
                { food: foodMap.get("פרגיות"), grams: 200, role: MealItemRole.PROTEIN },
                { food: foodMap.get("כבד בקר"), grams: 150, role: MealItemRole.PROTEIN },
                { food: foodMap.get("שניצלים"), grams: 120, role: MealItemRole.PROTEIN },
                { food: foodMap.get("קציצות בקר"), grams: 150, role: MealItemRole.PROTEIN },
                { food: foodMap.get("סלמון אפוי"), grams: 150, role: MealItemRole.PROTEIN },
                { food: foodMap.get("לברק אפוי"), grams: 150, role: MealItemRole.PROTEIN },
              ],
            },
          ],
        },
        {
          name: "העמסת פחמימות",
          options: [
            {
              name: "אופציית בריאות הנפש (CHEAT)",
              kind: MealTemplateKind.CARB_LOAD,
              items: [
                { food: foodMap.get("משולש פיצה"), grams: 130, role: MealItemRole.MENTAL_HEALTH },
                { food: foodMap.get("נאגטס"), grams: 100, role: MealItemRole.MENTAL_HEALTH },
                { food: foodMap.get("חלה"), grams: 80, role: MealItemRole.MENTAL_HEALTH },
                { food: foodMap.get("המבורגר"), grams: 200, role: MealItemRole.MENTAL_HEALTH },
                { food: foodMap.get("צ'יפס"), grams: 150, role: MealItemRole.MENTAL_HEALTH },
                { food: foodMap.get("פיתה שווארמה"), grams: 250, role: MealItemRole.MENTAL_HEALTH },
                { food: foodMap.get("אלכוהול - בירה"), grams: 500, role: MealItemRole.MENTAL_HEALTH },
              ],
            },
            {
              name: "אופציית בריאות",
              kind: MealTemplateKind.CARB_LOAD,
              items: [
                { food: foodMap.get("פיתה לבנה"), grams: 100, role: MealItemRole.CARB },
                { food: foodMap.get("אורז לבן מבושל"), grams: 200, role: MealItemRole.CARB },
                { food: foodMap.get("לחמנייה"), grams: 80, role: MealItemRole.CARB },
                { food: foodMap.get("פיתה כוסמין"), grams: 100, role: MealItemRole.CARB },
                { food: foodMap.get("תפוח אדמה מבושל"), grams: 200, role: MealItemRole.CARB },
                { food: foodMap.get("פסטה מבושלת"), grams: 200, role: MealItemRole.CARB },
                { food: foodMap.get("קוסקוס מבושל"), grams: 150, role: MealItemRole.CARB },
                { food: foodMap.get("לחם פרוס"), grams: 60, role: MealItemRole.CARB },
                {
                  food: foodMap.get("פסטה בולונז"),
                  grams: 200,
                  role: MealItemRole.CARB,
                  notes: "מנה משולבת פסטה + רוטב",
                },
                {
                  food: foodMap.get("טחינה גולמית"),
                  grams: 30,
                  role: MealItemRole.HEALTH,
                  notes: "שומן בריא",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const createdMenus = [];

  for (const template of templatesData) {
    // יוצרים TemplateMenu
    const menu = await prisma.templateMenu.create({
      data: {
        coachId: COACH_ID,
        name: template.name,
        dayType: template.dayType,
        notes: template.notes,
        totalCalories: 0,
      },
    });

    // ויטמינים
    for (const vit of template.vitamins || []) {
      await prisma.templateMenuVitamin.create({
        data: {
          templateMenuId: menu.id,
          name: vit.name,
          description: vit.description ?? null,
        },
      });
    }

    let menuTotalCalories = 0;

    // ארוחות
    for (const mealDef of template.meals) {
      const meal = await prisma.templateMenuMeal.create({
        data: {
          templateMenuId: menu.id,
          name: mealDef.name,
          selectedOptionId: null,
        },
      });

      let firstOptionId = null;

      for (let i = 0; i < mealDef.options.length; i++) {
        const optDef = mealDef.options[i];

        // יוצרים MealTemplate עבור האופציה
        const mt = await createMealTemplate({
          name: `${mealDef.name} - ${optDef.name}`,
          kind: optDef.kind,
          coachId: COACH_ID,
          items: optDef.items.filter((it) => it.food), // לוודא שלא נכנס undefined
        });

        // יוצרים TemplateMenuMealOption
        const opt = await prisma.templateMenuMealOption.create({
          data: {
            mealId: meal.id,
            mealTemplateId: mt.id,
            name: optDef.name,
            orderIndex: i,
          },
        });

        if (!firstOptionId) {
          firstOptionId = opt.id;
          menuTotalCalories += mt.totalCalories;
        }
      }

      if (firstOptionId) {
        await prisma.templateMenuMeal.update({
          where: { id: meal.id },
          data: { selectedOptionId: firstOptionId },
        });
      }
    }

    const updatedMenu = await prisma.templateMenu.update({
      where: { id: menu.id },
      data: { totalCalories: menuTotalCalories },
      include: {
        meals: { include: { options: true } },
        vitamins: true,
      },
    });

    createdMenus.push(updatedMenu);
  }

  console.log(`✅ Created ${createdMenus.length} TemplateMenus`);
  return createdMenus;
}

// ==================== MAIN ====================

async function main() {
  try {
    await clearDb();
    const foodMap = await seedFoodItems();
    await seedVitamins();
    await seedTemplateMenus(foodMap);
    console.log("🌱 Seed completed successfully");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
