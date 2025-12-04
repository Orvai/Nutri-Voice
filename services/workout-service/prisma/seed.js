/* eslint-disable no-console */
const {
  PrismaClient,
  MealTemplateKind,
  MealItemRole,
  DayType,
} = require("@prisma/client");

const prisma = new PrismaClient();

const COACH_ID = "ba59ccee-bd43-4102-acb8-fd11184c2bad";

// ==================== CLEAR DB ====================

async function clearDb() {
  console.log("🧹 Clearing existing data...");

  // CLIENT MENUS (תלויות ב-templateMenu, vitaminMaster, foodItem וכו')
  await prisma.clientMenuMealItem.deleteMany();
  await prisma.clientMenuMealOption.deleteMany();
  await prisma.clientMenuVitamin.deleteMany();
  await prisma.clientMenuMeal.deleteMany();
  await prisma.clientMenu.deleteMany();

  // TEMPLATE MENUS
  await prisma.templateMenuMealOption.deleteMany();
  await prisma.templateMenuMeal.deleteMany();
  await prisma.templateMenuVitamin.deleteMany();
  await prisma.templateMenu.deleteMany();

  // MEAL TEMPLATES
  await prisma.mealTemplateItem.deleteMany();
  await prisma.clientMenuMealOption.deleteMany(); // ליתר בטחון אם נוצרו
  await prisma.mealTemplate.deleteMany();

  // MASTER TABLES
  await prisma.clientMenuVitamin.deleteMany(); // אם נשאר משהו
  await prisma.vitaminMaster.deleteMany();
  await prisma.foodItem.deleteMany();

  console.log("✅ DB cleared");
}

// ==================== SEED FOOD ITEMS ====================

async function seedFoodItems() {
  console.log("🥗 Creating FoodItems...");

  const foodsData = [
    // חלבונים
    { name: "חזה עוף", category: "בשרי", caloriesPer100g: 160, proteinPer100g: 31 },
    { name: "פרגית", category: "בשרי", caloriesPer100g: 200, proteinPer100g: 27 },
    { name: "כבד עוף", category: "בשרי", caloriesPer100g: 165, proteinPer100g: 25 },
    { name: "כבדי בקר", category: "בשרי", caloriesPer100g: 180, proteinPer100g: 27 },
    { name: "דג סלמון", category: "דגים", caloriesPer100g: 200, proteinPer100g: 22 },
    { name: "טונה במים", category: "דגים", caloriesPer100g: 120, proteinPer100g: 26 },
    { name: "ביצים", category: "ביצים", caloriesPer100g: 155, proteinPer100g: 13 },

    // חלב
    { name: "גבינה לבנה 5%", category: "חלבי", caloriesPer100g: 120, proteinPer100g: 11 },
    { name: "קוטג' 5%", category: "חלבי", caloriesPer100g: 130, proteinPer100g: 11 },
    { name: "יוגורט לבן 3%", category: "חלבי", caloriesPer100g: 80, proteinPer100g: 4 },

    // פחמימות
    { name: "אורז לבן מבושל", category: "פחמימות", caloriesPer100g: 130, proteinPer100g: 2.5 },
    { name: "פסטה מבושלת", category: "פחמימות", caloriesPer100g: 140, proteinPer100g: 5 },
    { name: "פתיתים מבושלים", category: "פחמימות", caloriesPer100g: 120, proteinPer100g: 3 },
    { name: "לחם פרוס מלא", category: "פחמימות", caloriesPer100g: 240, proteinPer100g: 10 },
    { name: "תפוח אדמה אפוי", category: "פחמימות", caloriesPer100g: 90, proteinPer100g: 2 },

    // שומנים / בריאות
    { name: "טחינה גולמית", category: "שומנים", caloriesPer100g: 595, proteinPer100g: 17 },
    { name: "שמן זית", category: "שומנים", caloriesPer100g: 884, proteinPer100g: 0 },

    // מתוקים / חטיפים להעמסת פחמימות
    { name: "פיתה לבנה", category: "פחמימות", caloriesPer100g: 260, proteinPer100g: 9 },
    { name: "עוגת שמרים", category: "מתוקים", caloriesPer100g: 320, proteinPer100g: 5 },
    { name: "חטיף אנרגיה", category: "מתוקים", caloriesPer100g: 420, proteinPer100g: 8 },
  ];

  const created = await Promise.all(
    foodsData.map((f) =>
      prisma.foodItem.create({
        data: {
          name: f.name,
          category: f.category,
          caloriesPer100g: f.caloriesPer100g,
          proteinPer100g: f.proteinPer100g,
        },
      })
    )
  );

  console.log(`✅ Created ${created.length} FoodItems`);

  const map = new Map();
  for (const food of created) {
    map.set(food.name, food);
  }
  return map;
}

// ==================== SEED VITAMIN MASTER ====================

async function seedVitaminMasters() {
  console.log("💊 Creating VitaminMaster items...");

  const vitaminsData = [
    {
      name: "מולטי ויטמין",
      description: "מולטי ויטמין כללי פעם ביום.",
    },
    {
      name: "אומגה 3",
      description: "2 קפסולות ביום עם ארוחה.",
    },
    {
      name: "ויטמין D",
      description: "מנה יומית לפי המלצת רופא.",
    },
  ];

  const created = [];
  for (const v of vitaminsData) {
    const vitamin = await prisma.vitaminMaster.create({
      data: {
        name: v.name,
        description: v.description,
      },
    });
    created.push(vitamin);
  }

  console.log(`✅ Created ${created.length} VitaminMaster records`);

  const map = new Map();
  for (const v of created) {
    map.set(v.name, v);
  }
  return map;
}

// ==================== HELPERS ====================

function calcCalories(caloriesPer100g, grams) {
  if (!caloriesPer100g) return 0;
  return Math.round((caloriesPer100g * grams) / 100);
}

// יצירת MealTemplate + items
async function createMealTemplate(prismaTx, { name, kind, coachId, items }) {
  let totalCalories = 0;

  const mt = await prismaTx.mealTemplate.create({
    data: {
      name,
      kind,
      coachId,
      totalCalories: 0, // נעדכן אחר כך
    },
  });

  for (const item of items) {
    const defaultCalories = calcCalories(item.food.caloriesPer100g, item.grams);
    totalCalories += defaultCalories;

    await prismaTx.mealTemplateItem.create({
      data: {
        foodItemId: item.food.id,
        mealTemplateId: mt.id,
        role: item.role,
        defaultGrams: item.grams,
        defaultCalories,
        notes: item.notes || null,
      },
    });
  }

  const updated = await prismaTx.mealTemplate.update({
    where: { id: mt.id },
    data: { totalCalories },
  });

  return updated;
}

// ==================== SEED TEMPLATE MENUS ====================

async function seedTemplateMenus(foodMap, vitaminMap) {
  console.log("📋 Creating TemplateMenus...");

  const templatesData = [
    {
      name: "יום ללא אימון",
      dayType: DayType.REST,
      notes: 'קלוריות חופשיות (הגבלה 100 קק"ל מכל מאכל העולה על רוחך).',
      vitamins: [
        {
          name: "מולטי ויטמין",
          description: "פעם ביום, עדיפות אחרי אחת הארוחות.",
        },
      ],
      meals: [
        {
          name: "ארוחה 1",
          options: [
            {
              name: "אופציה בסיסית",
              kind: MealTemplateKind.MEAT_MEAL,
              items: [
                {
                  food: foodMap.get("חזה עוף"),
                  grams: 200,
                  role: MealItemRole.PROTEIN,
                  notes: "חזה עוף 200 גרם",
                },
                {
                  food: foodMap.get("אורז לבן מבושל"),
                  grams: 160,
                  role: MealItemRole.CARB,
                  notes: "אורז לבן 160 גרם",
                },
              ],
            },
          ],
        },
        {
          name: "ארוחה 2",
          options: [
            {
              name: "אופציה מוצרי חלב",
              kind: MealTemplateKind.DAIRY_MEAL,
              items: [
                {
                  food: foodMap.get("גבינה לבנה 5%"),
                  grams: 200,
                  role: MealItemRole.PROTEIN,
                  notes: "גבינה לבנה 5% 200 גרם",
                },
                {
                  food: foodMap.get("פתיתים מבושלים"),
                  grams: 150,
                  role: MealItemRole.CARB,
                  notes: "פתיתים 150 גרם",
                },
              ],
            },
          ],
        },
      ],
    },

    {
      name: "יום אימון 2X",
      dayType: DayType.TRAINING,
      notes:
        "יום אימון כפול 2X. ארוחה 1 לפני/אחרי אימון, כולל שתי אופציות חלבון. בנוסף העמסת פחמימות עם שתי אופציות.",
      vitamins: [
        {
          name: "אומגה 3",
          description: "2 קפסולות אחרי ארוחה 2.",
        },
      ],
      meals: [
        {
          name: "ארוחה 1 (לפני/אחרי אימון)",
          options: [
            {
              name: "אופציה א - עוף",
              kind: MealTemplateKind.MEAT_MEAL,
              items: [
                {
                  food: foodMap.get("חזה עוף"),
                  grams: 200,
                  role: MealItemRole.PROTEIN,
                  notes: "חזה עוף 200 גרם",
                },
                {
                  food: foodMap.get("אורז לבן מבושל"),
                  grams: 160,
                  role: MealItemRole.CARB,
                  notes: "אורז 160 גרם",
                },
              ],
            },
            {
              name: "אופציה ב - סלמון",
              kind: MealTemplateKind.MEAT_MEAL,
              items: [
                {
                  food: foodMap.get("דג סלמון"),
                  grams: 200,
                  role: MealItemRole.PROTEIN,
                  notes: "סלמון 200 גרם",
                },
                {
                  food: foodMap.get("תפוח אדמה אפוי"),
                  grams: 200,
                  role: MealItemRole.CARB,
                  notes: "תפוח אדמה 200 גרם",
                },
              ],
            },
          ],
        },
        {
          name: "העמסת פחמימות",
          options: [
            {
              name: "אופציית בריאות הנפש",
              kind: MealTemplateKind.CARB_LOAD,
              items: [
                {
                  food: foodMap.get("פיתה לבנה"),
                  grams: 120,
                  role: MealItemRole.CARB,
                  notes: "פיתה לבנה",
                },
                {
                  food: foodMap.get("עוגת שמרים"),
                  grams: 80,
                  role: MealItemRole.FREE,
                  notes: "חתיכת עוגה",
                },
              ],
            },
            {
              name: "אופציית בריאות",
              kind: MealTemplateKind.CARB_LOAD,
              items: [
                {
                  food: foodMap.get("אורז לבן מבושל"),
                  grams: 200,
                  role: MealItemRole.CARB,
                  notes: "אורז 200 גרם",
                },
                {
                  food: foodMap.get("חטיף אנרגיה"),
                  grams: 50,
                  role: MealItemRole.FREE,
                  notes: "חטיף אחד",
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
    const menu = await prisma.templateMenu.create({
      data: {
        coachId: COACH_ID,
        name: template.name,
        dayType: template.dayType,
        notes: template.notes,
        totalCalories: 0, // נעדכן בסוף
      },
    });

    // ויטמינים לתפריט (TemplateMenuVitamin) כולל vitaminId ל-VitaminMaster אם קיים
    for (const vit of template.vitamins || []) {
      const master = vitaminMap.get(vit.name);
      await prisma.templateMenuVitamin.create({
        data: {
          templateMenuId: menu.id,
          name: vit.name,
          description: vit.description || master?.description || null,
          vitaminId: master ? master.id : null,
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
          selectedOptionId: null, // נעדכן אחרי יצירת האופציות
        },
      });

      let firstOptionId = null;

      for (let i = 0; i < mealDef.options.length; i++) {
        const optDef = mealDef.options[i];

        // יוצרים MealTemplate עבור האופציה
        const mt = await createMealTemplate(prisma, {
          name: `${mealDef.name} - ${optDef.name}`,
          kind: optDef.kind,
          coachId: COACH_ID,
          items: optDef.items,
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

      // מעדכנים selectedOptionId של הארוחה
      await prisma.templateMenuMeal.update({
        where: { id: meal.id },
        data: { selectedOptionId: firstOptionId },
      });
    }

    // עדכון totalCalories לתפריט
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
    const vitaminMap = await seedVitaminMasters();
    await seedTemplateMenus(foodMap, vitaminMap);
    console.log("🌱 Seed completed successfully");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
