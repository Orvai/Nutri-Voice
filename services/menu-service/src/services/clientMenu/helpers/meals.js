// src/services/clientMenu/helpers/meals.js

const { computeCalories } = require("./items");

const withStatus = (error, status = 400) => Object.assign(error, { status });

const validateOptionTemplate = (option, mealName) => {
  if (!option.mealTemplateId) {
    throw withStatus(
      new Error(`Template option ${option.id} for meal ${mealName} is missing mealTemplateId`)
    );
  }

  if (!option.mealTemplate) {
    throw withStatus(
      new Error(`Template option ${option.id} for meal ${mealName} is missing mealTemplate details`)
    );
  }

  if (!option.mealTemplate.items?.length) {
    throw withStatus(
      new Error(`Meal template ${option.mealTemplateId} for meal ${mealName} has no items`)
    );
  }

  const missingItem = option.mealTemplate.items.find(
    (item) => !item.foodItemId || !item.foodItem
  );
  if (missingItem) {
    throw withStatus(
      new Error(
        `Meal template ${option.mealTemplateId} for meal ${mealName} has an item without a linked food item`
      )
    );
  }
};

const fetchMealOrThrow = async (tx, id, menuId) => {
  const meal = await tx.clientMenuMeal.findUnique({ where: { id } });
  if (!meal || meal.clientMenuId !== menuId)
    throw Object.assign(new Error("ClientMenuMeal not found"), { status: 404 });
  return meal;
};

const addMealOptions = async (tx, menuId, optionsToAdd = []) => {
  if (!optionsToAdd?.length) return;

  for (const option of optionsToAdd) {
    const meal = await fetchMealOrThrow(tx, option.mealId, menuId);

    await tx.clientMenuMealOption.create({
      data: {
        clientMenuMealId: meal.id,
        mealTemplateId: option.mealTemplateId ?? null,
        name: option.name ?? null,
        orderIndex: option.orderIndex ?? 0,
      },
    });
  }
};

const deleteMealOptions = async (tx, menuId, optionsToDelete = []) => {
  if (!optionsToDelete?.length) return;

  await tx.clientMenuMealOption.deleteMany({
    where: {
      id: { in: optionsToDelete.map((opt) => opt.id) },
      clientMenuMeal: { clientMenuId: menuId },
    },
  });
};

// COPY template meal → ClientMenuMeal + items
const copyTemplateMeal = async (tx, menuId, chosenOption, mealName) => {
  let totalCalories = 0;

  validateOptionTemplate(chosenOption, mealName);

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

// UPDATE meals
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

    if (meal.selectedOptionId !== undefined) {
      await tx.clientMenuMeal.update({
        where: { id: existing.id },
        data: { selectedOptionId: meal.selectedOptionId },
      });
    }

    if (meal.totalCalories !== undefined) {
      await tx.clientMenuMeal.update({
        where: { id: existing.id },
        data: { totalCalories: meal.totalCalories },
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
  try {
    const createdMeals = [];

    for (const meal of templateMeals) {
      if (!meal.options?.length) {
        throw withStatus(new Error(`Template meal ${meal.id} has no options`));
      }

      let chosen = null;

      const manual = selectedOptions.find((s) => s.templateMealId === meal.id);
      if (manual) chosen = meal.options.find((o) => o.id === manual.optionId);

      if (!chosen && meal.selectedOptionId)
        chosen = meal.options.find((o) => o.id === meal.selectedOptionId);

      if (!chosen) chosen = meal.options[0];

      meal.options.forEach((opt) => validateOptionTemplate(opt, meal.name));

      const createdMeal = await copyTemplateMeal(tx, menuId, chosen, meal.name);

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
  } catch (error) {
    if (error.status) throw error;

    throw withStatus(
      new Error(`Failed while adding meals from templates: ${error.message}`),
      400
    );
  }
};

module.exports = {
  deleteMeals,
  updateMeals,
  addMealsFromTemplates,
  addMealOptions,
  deleteMealOptions,
};
