// src/services/clientMenu/clientMenu.service.js
const prisma = require("../../db/prisma");

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

  // לוגיקה הכבדה כעת רק ב־helpers/meals & helpers/vitamins
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
};

module.exports = {
  createClientMenu,
  listClientMenus,
  getClientMenu,
  updateClientMenu,
  deleteClientMenu,
  createClientMenuFromTemplate,
};
