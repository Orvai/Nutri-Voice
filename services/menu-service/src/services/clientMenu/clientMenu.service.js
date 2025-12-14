// src/services/clientMenu/clientMenu.service.js
const prisma = require("../../db/prisma");
const { Prisma } = require("@prisma/client");

const {
  deleteMeals,
  updateMeals,
  addMealsFromTemplates,
  addMealOptions,
  deleteMealOptions,
} = require("./helpers/meals");

const {
  deleteMealItems,
  updateMealItems,
  addMealItems,
} = require("./helpers/items");

const {
  addClientMenuVitamins,
  updateClientMenuVitamins,
  deleteClientMenuVitamins,
} = require("./helpers/vitamins");

const {
  recomputeMenuCalories,
} = require("./helpers/recompute");

const withStatus = (error, status) => Object.assign(error, { status });

const validateTemplateForClientMenu = (template, selectedOptions = []) => {
  // Ensure every meal has options and the selected option belongs to that meal
  const mealsById = new Map(template.meals.map((meal) => [meal.id, meal]));

  for (const selection of selectedOptions) {
    const meal = mealsById.get(selection.templateMealId);
    if (!meal) {
      throw withStatus(
        new Error(`Selected meal ${selection.templateMealId} is not part of the template`),
        400
      );
    }

    const option = meal.options.find((opt) => opt.id === selection.optionId);
    if (!option) {
      throw withStatus(
        new Error(`Selected option ${selection.optionId} does not belong to meal ${meal.id}`),
        400
      );
    }
  }

  // Guard against malformed template data (missing options / missing mealTemplate relation)
  for (const meal of template.meals) {
    if (!meal.options?.length) {
      throw withStatus(
        new Error(`Template meal ${meal.id} has no options defined`),
        400
      );
    }

    const missingTemplate = meal.options.find((opt) => !opt.mealTemplate);
    if (missingTemplate) {
      throw withStatus(
        new Error(`Template option ${missingTemplate.id} is missing its linked meal template`),
        400
      );
    }
  }
};

// =========================================================
// CREATE empty ClientMenu
// =========================================================
const createClientMenu = async (data, coachId, clientId) => {
  const menu = await prisma.clientMenu.create({
    data: {
      name: data.name,
      clientId,
      coachId,
      type: data.type,
      notes: data.notes ?? null,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });

  return getClientMenu(menu.id);
};

// =========================================================
// UPDATE ClientMenu (meals/items/vitamins)
// =========================================================
const updateClientMenu = async (id, data) => {

  await prisma.$transaction(async (tx) => {
    const existing = await tx.clientMenu.findUnique({ where: { id } });
    if (!existing) {
      throw Object.assign(new Error("Client menu not found"), { status: 404 });
    }

    // 1. Update metadata
    await tx.clientMenu.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        type: data.type ?? existing.type,
        notes: data.notes ?? existing.notes,
        isActive: data.isActive ?? existing.isActive,
        startDate:
          data.startDate !== undefined
            ? (data.startDate ? new Date(data.startDate) : null)
            : existing.startDate,
        endDate:
          data.endDate !== undefined
            ? (data.endDate ? new Date(data.endDate) : null)
            : existing.endDate,
      },
    });

    // 2. Map top-level item actions to the relevant meal (for generic UI payloads)
    let mealsToUpdate = data.mealsToUpdate ?? [];

    if (
      (data.itemsToAdd?.length || data.itemsToUpdate?.length || data.itemsToDelete?.length) &&
      (data.mealId || data.mealTemplateId)
    ) {
      const targetMeal = await tx.clientMenuMeal.findFirst({
        where: {
          clientMenuId: id,
          ...(data.mealId ? { id: data.mealId } : {}),
          ...(data.mealTemplateId ? { originalTemplateId: data.mealTemplateId } : {}),
        },
      });

      if (!targetMeal) {
        throw Object.assign(new Error("Target meal not found for update"), { status: 400 });
      }

      mealsToUpdate = [
        ...mealsToUpdate,
        {
          id: targetMeal.id,
          itemsToAdd: data.itemsToAdd,
          itemsToUpdate: data.itemsToUpdate,
          itemsToDelete: data.itemsToDelete,
        },
      ];
    }

    // 3. Meals CRUD
    await deleteMeals(tx, id, data.mealsToDelete);
    await updateMeals(tx, id, mealsToUpdate);
    await addMealsFromTemplates(tx, id, data.mealsToAdd);

    // 3b. Meal options CRUD
    await deleteMealOptions(tx, id, data.mealOptionsToDelete);
    await addMealOptions(tx, id, data.mealOptionsToAdd);

    // 4. Vitamins CRUD
    await deleteClientMenuVitamins(tx, id, data.vitaminsToDelete);
    await updateClientMenuVitamins(tx, id, data.vitaminsToUpdate);
    await addClientMenuVitamins(tx, id, data.vitaminsToAdd);

    // 5. Recompute calories
    await recomputeMenuCalories(tx, id);
  });

  return getClientMenu(id);
};

// =========================================================
// LIST – lightweight for tabs
// =========================================================
const listClientMenus = async (query) => {
  const includeInactive = query.includeInactive === "true";

  return prisma.clientMenu.findMany({
    where: {
      ...(query.clientId && { clientId: query.clientId }),
      ...(query.coachId && { coachId: query.coachId }),
      ...(!includeInactive && { isActive: true }),
    },
    select: {
      id: true,
      name: true,
      type: true,
      isActive: true,
      totalCalories: true,
      startDate: true,
      endDate: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// =========================================================
// GET — FULL DTO
// =========================================================
const getClientMenu = async (id) => {
  const menu = await prisma.clientMenu.findUnique({
    where: { id },
    include: {
      meals: {
        include: {
          items: {
            include: { foodItem: true },
          },
          options: {
            include: {
              mealTemplate: {
                include: {
                  items: { include: { foodItem: true } },
                },
              },
            },
          },
        },
      },
      vitamins: {
        include: {
          vitamin: true,
        },
      },
    },
  });

  if (!menu) {
    throw Object.assign(new Error("Client menu not found"), { status: 404 });
  }

  return menu;
};

// =========================================================
// DELETE = deactivate
// =========================================================
const deleteClientMenu = async (id) => {
  return prisma.clientMenu.update({
    where: { id },
    data: { isActive: false },
  });
};

// =========================================================
// CREATE FROM TEMPLATE
// =========================================================
const createClientMenuFromTemplate = async (data, coachId, clientId) => {
  try {
    const menu = await prisma.$transaction(async (tx) => {
      console.log("====== 🟧 Loading templateMenu from DB ======");
      const template = await tx.templateMenu.findUnique({
        where: { id: data.templateMenuId },
        include: {
          meals: {
            include: {
              options: {
                include: {
                  mealTemplate: {
                    include: { items: { include: { foodItem: true } } }
                  }
                }
              }
            }
          },
          vitamins: true,
        },
      });

      console.log("🔎 templateMenu loaded:");
      console.log(JSON.stringify(template, null, 2));

      if (!template) {
        throw Object.assign(new Error("Template menu not found"), { status: 404 });
      }

      console.log("====== 🟥 Validating template structure... ======");
      validateTemplateForClientMenu(template, data.selectedOptions);
      console.log("✅ Template validation passed!");

      console.log("====== 🟩 Creating ClientMenu ======");
      const clientMenu = await tx.clientMenu.create({
        data: {
          name: data.name ?? template.name,
          clientId,
          coachId,
          type: template.dayType,
          notes: template.notes ?? null,
          originalTemplateMenuId: template.id,
        },
      });

      const menuId = clientMenu.id;

      console.log("====== 🟪 Creating meals from template... ======");
      await addMealsFromTemplates(tx, menuId, template.meals, data.selectedOptions);

      console.log("====== 🟪 Copying vitamins... ======");
      await addClientMenuVitamins(tx, menuId, template.vitamins);

      console.log("====== 🟪 Recomputing calories... ======");
      await recomputeMenuCalories(tx, menuId);

      console.log("====== ✅ ClientMenu created successfully ======");

      return clientMenu;
    });

    console.log("====== 🔵 Returning getClientMenu ======");
    return await getClientMenu(menu.id);

  } catch (error) {
    console.error("🔥🔥🔥 INTERNAL ERROR in createClientMenuFromTemplate 🔥🔥🔥");
    console.error("message:", error.message);
    console.error("status:", error.status);
    console.error("code:", error.code);
    console.error("meta:", error.meta);
    console.error("stack:", error.stack);

    // כיבוד status שהוגדר
    if (error?.status) throw error;

    // שגיאת Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const status = error.code === "P2025" ? 404 : 400;
      throw Object.assign(new Error("Failed to create client menu from template"), {
        status,
        code: error.code,
        details: error.meta,
      });
    }

    throw error;
  }
};

module.exports = {
  createClientMenu,
  listClientMenus,
  getClientMenu,
  updateClientMenu,
  deleteClientMenu,
  createClientMenuFromTemplate,
};