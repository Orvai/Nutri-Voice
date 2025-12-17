const withStatus = (e, s = 400) => Object.assign(e, { status: s });

/**
 * ===============================
 * DELETE CLIENT MEALS
 * ===============================
 */
const deleteMeals = async (tx, clientMenuId, meals = []) => {
  if (!meals?.length) return;

  await tx.clientMenuMeal.deleteMany({
    where: {
      id: { in: meals.map((m) => m.id) },
      clientMenuId,
    },
  });
};

/**
 * ===============================
 * UPDATE CLIENT MEALS (META ONLY)
 * ===============================
 */
const updateMeals = async (tx, clientMenuId, mealsToUpdate = []) => {
  for (const meal of mealsToUpdate) {
    const existing = await tx.clientMenuMeal.findFirst({
      where: {
        id: meal.id,
        clientMenuId,
      },
    });

    if (!existing) {
      throw withStatus(
        new Error(`Client meal ${meal.id} not found`),
        404
      );
    }

    // ---------------------------
    // Split DB fields vs nested ops
    // ---------------------------
    const {
      optionsToAdd,
      optionsToUpdate,
      optionsToDelete,
      ...mealData
    } = meal;

    // ---------------------------
    // Update meal fields
    // ---------------------------
    await tx.clientMenuMeal.update({
      where: { id: meal.id },
      data: {
        name: mealData.name ?? undefined,
        notes: mealData.notes ?? undefined,
        totalCalories:
          mealData.totalCalories !== undefined
            ? mealData.totalCalories
            : undefined,
        selectedOptionId:
          mealData.selectedOptionId !== undefined
            ? mealData.selectedOptionId
            : undefined,
      },
    });

    // ---------------------------
    // Add options to meal
    // ---------------------------
    if (optionsToAdd?.length) {
      for (const opt of optionsToAdd) {
        const created = await tx.clientMenuMealOption.create({
          data: {
            name: opt.name ?? null,
            orderIndex: opt.orderIndex ?? 0,
        
            clientMenuMeal: {
              connect: { id: meal.id },
            },
          },
        });

        // add items if provided
        if (opt.items?.length) {
          await tx.clientMenuMealOptionItem.createMany({
            data: opt.items.map((item) => ({
              optionId: created.id,
              foodItemId: item.foodItemId,
              role: item.role,
              grams: item.grams ?? 100,
            })),
          });
        }
      }
    }

    // ---------------------------
    // Update options
    // ---------------------------
    if (optionsToUpdate?.length) {
      await updateMealOptions(tx, optionsToUpdate);
    }

    // ---------------------------
    // Delete options
    // ---------------------------
    if (optionsToDelete?.length) {
      await tx.clientMenuMealOption.deleteMany({
        where: {
          id: { in: optionsToDelete.map((o) => o.id) },
          clientMenuMealId: meal.id,
        },
      });
    }
  }
};

/**
 * ===============================
 * ADD CLIENT MEALS (FREE / CUSTOM)
 * ===============================
 */
const addMeals = async (tx, clientMenuId, mealsToAdd = []) => {
  for (const meal of mealsToAdd) {
    await tx.clientMenuMeal.create({
      data: {
        clientMenuId,
        name: meal.name,
        notes: meal.notes ?? null,
        totalCalories: meal.totalCalories,
      },
    });
  }
};

/**
 * =====================================================
 * ADD CLIENT MEALS FROM TEMPLATE (DEEP COPY, DB-DRIVEN)
 * =====================================================
 */
const addMealsFromTemplates = async (
  tx,
  clientMenuId,
  templateMeals,
  selectedOptions = []
) => {
  for (const templateMeal of templateMeals) {
    const clientMeal = await tx.clientMenuMeal.create({
      data: {
        clientMenuId,
        name: templateMeal.name,
        notes: templateMeal.notes ?? null,
        totalCalories: templateMeal.totalCalories,
      },
    });

    const createdOptions = [];

    for (const opt of templateMeal.options) {
      const createdOption = await tx.clientMenuMealOption.create({
        data: {
          clientMenuMealId: clientMeal.id,
          mealTemplateId: opt.mealTemplateId,
          name: opt.name ?? null,
          orderIndex: opt.orderIndex ?? 0,
        },
      });

      const template = opt.mealTemplate;
      if (!template || !template.items?.length) {
        throw withStatus(
          new Error(`MealTemplate ${opt.mealTemplateId} has no items`),
          400
        );
      }

      for (const item of template.items) {
        await tx.clientMenuMealOptionItem.create({
          data: {
            optionId: createdOption.id,
            foodItemId: item.foodItemId,
            role: item.role,
            grams: item.grams ?? 100,
          },
        });
      }

      createdOptions.push(createdOption);
    }

    const manual = selectedOptions.find(
      (s) => s.templateMealId === templateMeal.id
    );

    let selected = createdOptions[0];

    if (manual) {
      const match = createdOptions.find(
        (o) => o.mealTemplateId === manual.optionId
      );
      if (match) selected = match;
    }

    await tx.clientMenuMeal.update({
      where: { id: clientMeal.id },
      data: { selectedOptionId: selected?.id ?? null },
    });
  }
};

/**
 * ===============================
 * ADD CLIENT MEAL OPTIONS (CUSTOM)
 * ===============================
 */

const addMealOptions = async (tx, mealId, options = []) => {
  for (const opt of options) {
    const createdOption = await tx.clientMenuMealOption.create({
      data: {
        clientMenuMealId: mealId,
        mealTemplateId: opt.mealTemplateId ?? null,
        name: opt.name ?? null,
        orderIndex: opt.orderIndex ?? 0,
      },
    });

    if (!opt.items?.length) {
      throw withStatus(
        new Error("ClientMenuMealOption must include items"),
        400
      );
    }

    for (const item of opt.items) {
      await tx.clientMenuMealOptionItem.create({
        data: {
          optionId: createdOption.id,
          foodItemId: item.foodItemId,
          role: item.role,
          grams: item.grams ?? 100,
        },
      });
    }
  }
};


/**
 * ===============================
 * UPDATE CLIENT MEAL OPTIONS
 * ===============================
 */
const updateMealOptions = async (tx, options = []) => {
  for (const opt of options) {
    const existingOption = await tx.clientMenuMealOption.findUnique({
      where: { id: opt.id },
    });

    if (!existingOption) {
      throw withStatus(
        new Error(`ClientMenuMealOption not found: ${opt.id}`),
        404
      );
    }

    // ---------------------------
    // Update option fields
    // ---------------------------
    await tx.clientMenuMealOption.update({
      where: { id: opt.id },
      data: {
        name:
          opt.name !== undefined ? opt.name : existingOption.name,
        orderIndex:
          opt.orderIndex !== undefined
            ? opt.orderIndex
            : existingOption.orderIndex,
      },
    });

    // ---------------------------
    // Delete items
    // ---------------------------
    if (opt.itemsToDelete?.length) {
      await tx.clientMenuMealOptionItem.deleteMany({
        where: {
          id: { in: opt.itemsToDelete.map((i) => i.id) },
          optionId: opt.id,
        },
      });
    }

    // ---------------------------
    // Update items
    // ---------------------------
    if (opt.itemsToUpdate?.length) {
      for (const item of opt.itemsToUpdate) {
        await tx.clientMenuMealOptionItem.update({
          where: { id: item.id },
          data: {
            role: item.role,
            grams: item.grams,
          },
        });
      }
    }

    // ---------------------------
    // Add new items
    // ---------------------------
    if (opt.itemsToAdd?.length) {
      for (const item of opt.itemsToAdd) {
        await tx.clientMenuMealOptionItem.create({
          data: {
            optionId: opt.id,
            foodItemId: item.foodItemId,
            role: item.role,
            grams: item.grams ?? 100,
          },
        });
      }
    }
  }
};

/**
 * ===============================
 * DELETE CLIENT MEAL OPTIONS
 * ===============================
 */
const deleteMealOptions = async (tx, options = []) => {
  if (!options?.length) return;

  await tx.clientMenuMealOption.deleteMany({
    where: {
      id: { in: options.map((o) => o.id) },
    },
  });
};

module.exports = {
  deleteMeals,
  updateMeals,
  addMeals,
  addMealsFromTemplates,
  addMealOptions,
  deleteMealOptions,
  updateMealOptions,
};
