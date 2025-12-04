// src/services/clientMenu/helpers/meals.js
const { computeCalories } = require("./items");

const fetchMealOrThrow = async (tx, id, menuId) => {
  const meal = await tx.clientMenuMeal.findUnique({ where: { id } });
  if (!meal || meal.clientMenuId !== menuId)
    throw Object.assign(new Error("ClientMenuMeal not found"), { status: 404 });
  return meal;
};

// COPY template meal → ClientMenuMeal + items
const copyTemplateMeal = async (tx, menuId, chosenOption, mealName) => {
  let totalCalories = 0;

  const itemsData = chosenOption.mealTemplate.items.map((tItem) => {
    const qty = tItem.defaultGrams ?? 100;
    const cal = computeCalories(tItem.foodItem, qty);
    totalCalories += cal;

    return {
      foodItemId: tItem.foodItemId,
      quantity: qty,
      calories: cal,
      notes: tItem.notes ?? null,
    };
  });

  return tx.clientMenuMeal.create({
    data: {
      clientMenuId: menuId,
      originalTemplateId: chosenOption.mealTemplateId,
      name: mealName,
      totalCalories,
      items: { create: itemsData },
    },
  });
};

// DELETE meals
const deleteMeals = async (tx, menuId, mealsToDelete = []) => {
  if (!mealsToDelete?.length) return;

  await tx.clientMenuMeal.deleteMany({
    where: { id: { in: mealsToDelete.map(m => m.id) }, clientMenuId: menuId },
  });
};

// UPDATE meals (just name + items)
const updateMeals = async (tx, menuId, mealsToUpdate = []) => {
  if (!mealsToUpdate?.length) return;

  const { deleteMealItems, updateMealItems, addMealItems } = require("./items");
  const { recomputeMealCalories } = require("./recompute");

  for (const meal of mealsToUpdate) {
    const existing = await fetchMealOrThrow(tx, meal.id, menuId);

    if (meal.name !== undefined) {
      await tx.clientMenuMeal.update({
        where: { id: existing.id },
        data: { name: meal.name },
      });
    }

    await deleteMealItems(tx, existing.id, meal.itemsToDelete);
    await updateMealItems(tx, existing.id, meal.itemsToUpdate);
    await addMealItems(tx, existing.id, meal.itemsToAdd);

    await recomputeMealCalories(tx, existing.id);
  }
};

// ADD meals from templates
const addMealsFromTemplates = async (tx, menuId, templateMeals, selectedOptions = []) => {
  const createdMeals = [];

  for (const meal of templateMeals) {
    // pick option
    let chosen = null;

    // 1. selected by user
    const manual = selectedOptions.find((s) => s.templateMealId === meal.id);
    if (manual) chosen = meal.options.find((o) => o.id === manual.optionId);

    // 2. selected by template
    if (!chosen && meal.selectedOptionId)
      chosen = meal.options.find((o) => o.id === meal.selectedOptionId);

    // 3. fallback first
    if (!chosen) chosen = meal.options[0];
    if (!chosen) continue;

    // create Meal
    const createdMeal = await copyTemplateMeal(tx, menuId, chosen, meal.name);

    // create ClientMenuMealOptions
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

    // set selectedOptionId
    const match = createdOptions.find(
      (o) => o.mealTemplateId === chosen.mealTemplateId
    );

    await tx.clientMenuMeal.update({
      where: { id: createdMeal.id },
      data: { selectedOptionId: match ? match.id : null },
    });

    createdMeals.push(createdMeal);
  }

  return createdMeals;
};

module.exports = {
  deleteMeals,
  updateMeals,
  addMealsFromTemplates,
};
