// src/services/clientMenu/clientMenu.service.js
const prisma = require("../../db/prisma");
const { Prisma } = require("@prisma/client");

const {
  deleteMeals,
  updateMeals,
  addMealsFromTemplates,
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

const {
  ClientMenuCreateRequestDto,
  ClientMenuUpdateRequestDto,
  ClientMenuCreateFromTemplateDto,
} = require("../../dto/clientMenu.dto");

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
const createClientMenu = async (payload, coachId) => {
  const data = ClientMenuCreateRequestDto.parse(payload);

  const menu = await prisma.clientMenu.create({
    data: {
      name: data.name,
      clientId: data.clientId,
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
const updateClientMenu = async (id, payload) => {
  const data = ClientMenuUpdateRequestDto.parse(payload);

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

    // 2. Meals CRUD
    await deleteMeals(tx, id, data.mealsToDelete);
    await updateMeals(tx, id, data.mealsToUpdate);
    await addMealsFromTemplates(tx, id, data.mealsToAdd);

    // 3. Vitamins CRUD
    await deleteClientMenuVitamins(tx, id, data.vitaminsToDelete);
    await updateClientMenuVitamins(tx, id, data.vitaminsToUpdate);
    await addClientMenuVitamins(tx, id, data.vitaminsToAdd);

    // 4. Recompute calories
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
const createClientMenuFromTemplate = async (payload) => {
  const data = ClientMenuCreateFromTemplateDto.parse(payload);

  try {
    const menu = await prisma.$transaction(async (tx) => {
      // 1. Load template
      const template = await tx.templateMenu.findUnique({
        where: { id: data.templateMenuId },
        include: {
          meals: {
            include: {
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
          vitamins: true,
        },
      });

      if (!template) {
        throw Object.assign(new Error("Template menu not found"), { status: 404 });
      }

      validateTemplateForClientMenu(template, data.selectedOptions);

      // 2. Create clientMenu
      const clientMenu = await tx.clientMenu.create({
        data: {
          name: data.name ?? template.name,
          clientId: data.clientId,
          coachId: data.coachId,
          type: template.dayType,
          notes: template.notes ?? null,
          originalTemplateMenuId: template.id,
        },
      });

      const menuId = clientMenu.id;


      // 3. Create meals + options + items
      await addMealsFromTemplates(tx, menuId, template.meals, data.selectedOptions);

      // 4. Copy vitamins
      await addClientMenuVitamins(tx, menuId, template.vitamins);

      // 5. Recompute total calories
      await recomputeMenuCalories(tx, menuId);

      return clientMenu;
    });

       return getClientMenu(menu.id);
  } catch (error) {
    if (error?.status) {
      throw error;
    }

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