const prisma = require("../../db/prisma");

const {
  deleteMeals,
  updateMeals,
  addMeals,
  addMealsFromTemplates,
  addMealOptions,
  deleteMealOptions,
} = require("./helpers/meals");

const {
  addClientMenuVitamins,
  updateClientMenuVitamins,
  deleteClientMenuVitamins,
} = require("./helpers/vitamins");

const { recomputeMenuCalories } = require("./helpers/recompute");

const withStatus = (error, status) => Object.assign(error, { status });

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
// UPDATE ClientMenu
// =========================================================
const updateClientMenu = async (id, data) => {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.clientMenu.findUnique({ where: { id } });
    if (!existing)
      throw withStatus(new Error("Client menu not found"), 404);

    await tx.clientMenu.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        type: data.type ?? existing.type,
        notes: data.notes ?? existing.notes,
        isActive: data.isActive ?? existing.isActive,
        startDate:
          data.startDate !== undefined
            ? data.startDate
              ? new Date(data.startDate)
              : null
            : existing.startDate,
        endDate:
          data.endDate !== undefined
            ? data.endDate
              ? new Date(data.endDate)
              : null
            : existing.endDate,
      },
    });

    await deleteMeals(tx, id, data.mealsToDelete);
    await updateMeals(tx, id, data.mealsToUpdate);
    await addMeals(tx, id, data.mealsToAdd);

    await deleteMealOptions(tx, data.mealOptionsToDelete);
    await addMealOptions(tx, data.mealOptionsToAdd);

    await deleteClientMenuVitamins(tx, id, data.vitaminsToDelete);
    await updateClientMenuVitamins(tx, id, data.vitaminsToUpdate);
    await addClientMenuVitamins(tx, id, data.vitaminsToAdd);

    await recomputeMenuCalories(tx, id);
  });

  return getClientMenu(id);
};

// =========================================================
// LIST (tabs)
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
// GET FULL
// =========================================================
const getClientMenu = async (id) => {
  const menu = await prisma.clientMenu.findUnique({
    where: { id },
    include: {
      meals: {
        include: {
          options: {
            include: {
              items: {
                include: {
                  foodItem: true,
                },
              },
            },
          },
        },
      },
      vitamins: {
        include: { vitamin: true },
      },
    },
  });

  if (!menu)
    throw withStatus(new Error("Client menu not found"), 404);

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
const createClientMenuFromTemplate = async (data) => {
  const { coachId, clientId } = data;

  const menu = await prisma.$transaction(async (tx) => {
    const template = await tx.templateMenu.findUnique({
      where: { id: data.templateMenuId },
      include: {
        meals: {
          include: {
            options: {
              include: {
                mealTemplate: {
                  include: { items: true },
                },
              },
            },
          },
        },
        vitamins: true,
      },
    });

    if (!template)
      throw withStatus(new Error("Template menu not found"), 404);

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

    await addMealsFromTemplates(
      tx,
      clientMenu.id,
      template.meals,
      data.selectedOptions
    );

    await addClientMenuVitamins(tx, clientMenu.id, template.vitamins);

    await recomputeMenuCalories(tx, clientMenu.id);

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
