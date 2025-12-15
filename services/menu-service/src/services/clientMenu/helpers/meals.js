const { computeCalories } = require("./items");
const withStatus = (e, s = 400) => Object.assign(e, { status: s });

const validateOptionTemplate = (option, mealName) => {
  if (!option.mealTemplate)
    throw withStatus(
      new Error(`Meal ${mealName} option missing mealTemplate`)
    );

  if (!option.mealTemplate.items?.length)
    throw withStatus(
      new Error(`MealTemplate ${option.mealTemplate.id} has no items`)
    );
};

const deleteMeals = async (tx, menuId, meals = []) => {
  if (!meals?.length) return;
  await tx.clientMenuMeal.deleteMany({
    where: { id: { in: meals.map((m) => m.id) }, clientMenuId: menuId },
  });
};

const updateMeals = async (tx, menuId, meals = []) => {
  if (!meals?.length) return;

  for (const meal of meals) {
    await tx.clientMenuMeal.update({
      where: { id: meal.id },
      data: {
        name: meal.name ?? undefined,
        selectedOptionId: meal.selectedOptionId ?? undefined,
        totalCalories: meal.totalCalories ?? undefined,
      },
    });
  }
};

// =========================================================
// ADD meals from template (NO items copy)
// =========================================================
const addMealsFromTemplates = async (
  tx,
  menuId,
  templateMeals,
  selectedOptions = []
) => {
  for (const meal of templateMeals) {
    let chosen = null;

    const manual = selectedOptions.find(
      (s) => s.templateMealId === meal.id
    );
    if (manual)
      chosen = meal.options.find((o) => o.id === manual.optionId);

    if (!chosen) chosen = meal.options[0];

    validateOptionTemplate(chosen, meal.name);

    const optionCalories =
      chosen.mealTemplate.totalCalories ??
      chosen.mealTemplate.items.reduce(
        (sum, i) =>
          sum +
          computeCalories(
            i.foodItem,
            i.defaultGrams ?? 100
          ),
        0
      );

    const createdMeal = await tx.clientMenuMeal.create({
      data: {
        clientMenuId: menuId,
        originalTemplateId: chosen.mealTemplateId,
        name: meal.name,
        totalCalories: optionCalories,
      },
    });

    const createdOptions = await Promise.all(
      meal.options.map((opt) =>
        tx.clientMenuMealOption.create({
          data: {
            clientMenuMealId: createdMeal.id,
            mealTemplateId: opt.mealTemplateId,
            name: opt.name ?? null,
            orderIndex: opt.orderIndex ?? 0,
          },
        })
      )
    );

    const selected = createdOptions.find(
      (o) => o.mealTemplateId === chosen.mealTemplateId
    );

    await tx.clientMenuMeal.update({
      where: { id: createdMeal.id },
      data: { selectedOptionId: selected?.id ?? null },
    });
  }
};

const addMealOptions = async (tx, menuId, options = []) => {
  if (!options?.length) return;

  for (const opt of options) {
    await tx.clientMenuMealOption.create({
      data: {
        clientMenuMealId: opt.mealId,
        mealTemplateId: opt.mealTemplateId,
        name: opt.name ?? null,
        orderIndex: opt.orderIndex ?? 0,
      },
    });
  }
};

const deleteMealOptions = async (tx, menuId, options = []) => {
  if (!options?.length) return;
  await tx.clientMenuMealOption.deleteMany({
    where: { id: { in: options.map((o) => o.id) } },
  });
};

module.exports = {
  deleteMeals,
  updateMeals,
  addMealsFromTemplates,
  addMealOptions,
  deleteMealOptions,
};
