// src/services/clientMenu.service.js
const prisma = require("../db/prisma");
const {
  ClientMenuCreateRequestDto,
  ClientMenuUpdateRequestDto,
} = require("../dto/clientMenu.dto");

const computeCalories = (foodItem, quantity) => {
  if (!foodItem || foodItem.caloriesPer100g == null || quantity == null) {
    return 0;
  }
  return (foodItem.caloriesPer100g / 100) * quantity;
};

const fetchFoodItemOrThrow = async (tx, id) => {
  const item = await tx.foodItem.findUnique({ where: { id } });
  if (!item) {
    const e = new Error(`FoodItem not found: ${id}`);
    e.status = 400;
    throw e;
  }
  return item;
};

const fetchMealOrThrow = async (tx, mealId, menuId) => {
  const meal = await tx.clientMenuMeal.findUnique({ where: { id: mealId } });

  if (!meal || meal.clientMenuId !== menuId) {
    const e = new Error("Client menu meal not found");
    e.status = 404;
    throw e;
  }

  return meal;
};

const fetchItemOrThrow = async (tx, itemId, mealId) => {
  const item = await tx.clientMenuMealItem.findUnique({ where: { id: itemId } });

  if (!item || item.clientMenuMealId !== mealId) {
    const e = new Error("Client menu meal item not found");
    e.status = 404;
    throw e;
  }

  return item;
};

const copyTemplateMeal = async (tx, menuId, template, nameOverride) => {
  let total = 0;

  const itemsData = template.items.map((tItem) => {
    const quantity = tItem.defaultGrams ?? 100;
    const calories = computeCalories(tItem.foodItem, quantity);
    total += calories;

    return {
      foodItemId: tItem.foodItemId,
      quantity,
      calories,
      notes: tItem.notes ?? null,
    };
  });

  return tx.clientMenuMeal.create({
    data: {
      clientMenuId: menuId,
      originalTemplateId: template.id,
      name: nameOverride ?? template.name,
      totalCalories: total,
      items: { create: itemsData },
    },
  });
};

const recomputeMealCalories = async (tx, mealId) => {
  const agg = await tx.clientMenuMealItem.aggregate({
    where: { clientMenuMealId: mealId },
    _sum: { calories: true },
  });

  const total = agg._sum.calories ?? 0;

  await tx.clientMenuMeal.update({
    where: { id: mealId },
    data: { totalCalories: total },
  });

  return total;
};

const recomputeMenuCalories = async (tx, menuId) => {
  const agg = await tx.clientMenuMeal.aggregate({
    where: { clientMenuId: menuId },
    _sum: { totalCalories: true },
  });

  const total = agg._sum.totalCalories ?? 0;

  return tx.clientMenu.update({
    where: { id: menuId },
    data: { totalCalories: total },
    include: {
      meals: { include: { items: true } },
    },
  });
};



const deleteMealItems = async (tx, mealId, itemsToDelete = []) => {
  if (itemsToDelete.length === 0) return;

  const ids = itemsToDelete.map((i) => i.id);

  await tx.clientMenuMealItem.deleteMany({
    where: {
      id: { in: ids },
      clientMenuMealId: mealId,
    },
  });
};

const updateMealItems = async (tx, mealId, itemsToUpdate = []) => {
  for (const itemUpdate of itemsToUpdate) {
    const existingItem = await fetchItemOrThrow(tx, itemUpdate.id, mealId);

    const newFoodItemId = itemUpdate.foodItemId ?? existingItem.foodItemId;
    const newQuantity = itemUpdate.quantity ?? existingItem.quantity;

    let calories = existingItem.calories;

    if (itemUpdate.foodItemId || itemUpdate.quantity) {
      const foodItem = await fetchFoodItemOrThrow(tx, newFoodItemId);
      calories = computeCalories(foodItem, newQuantity);
    }

    await tx.clientMenuMealItem.update({
      where: { id: existingItem.id },
      data: {
        foodItemId: newFoodItemId,
        quantity: newQuantity,
        calories,
        notes: itemUpdate.notes ?? existingItem.notes,
      },
    });
  }
};

const addMealItems = async (tx, mealId, itemsToAdd = []) => {
  for (const item of itemsToAdd) {
    const foodItem = await fetchFoodItemOrThrow(tx, item.foodItemId);
    const calories = computeCalories(foodItem, item.quantity);

    await tx.clientMenuMealItem.create({
      data: {
        clientMenuMealId: mealId,
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        calories,
        notes: item.notes ?? null,
      },
    });
  }
};


const deleteMeals = async (tx, menuId, mealsToDelete = []) => {
  if (mealsToDelete.length === 0) return;

  const ids = mealsToDelete.map((m) => m.id);

  await tx.clientMenuMeal.deleteMany({
    where: { id: { in: ids }, clientMenuId: menuId },
  });
};

const updateMeals = async (tx, menuId, mealsToUpdate = []) => {
  for (const mealUpdate of mealsToUpdate) {
    const meal = await fetchMealOrThrow(tx, mealUpdate.id, menuId);

    if (mealUpdate.name !== undefined) {
      await tx.clientMenuMeal.update({
        where: { id: meal.id },
        data: { name: mealUpdate.name },
      });
    }

    await deleteMealItems(tx, meal.id, mealUpdate.itemsToDelete);
    await updateMealItems(tx, meal.id, mealUpdate.itemsToUpdate);
    await addMealItems(tx, meal.id, mealUpdate.itemsToAdd);

    await recomputeMealCalories(tx, meal.id);
  }
};

const addMealsFromTemplates = async (tx, menuId, mealsToAdd = []) => {
  for (const mealToAdd of mealsToAdd) {
    const template = await tx.mealTemplate.findUnique({
      where: { id: mealToAdd.templateId },
      include: { items: { include: { foodItem: true } } },
    });

    if (!template) {
      const e = new Error(`Meal template not found: ${mealToAdd.templateId}`);
      e.status = 400;
      throw e;
    }

    await copyTemplateMeal(tx, menuId, template, mealToAdd.name);
  }
};


const createClientMenu = async (payload, coachId) => {
  const data = ClientMenuCreateRequestDto.parse(payload);

  return prisma.clientMenu.create({
    data: {
      name: data.name,
      clientId: data.clientId,
      coachId,
      type: data.type,
      notes: data.notes,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
    include: { meals: { include: { items: true } } },
  });
};

const updateClientMenu = async (id, payload) => {
  const data = ClientMenuUpdateRequestDto.parse(payload);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.clientMenu.findUnique({ where: { id } });
    if (!existing) {
      const e = new Error("Client menu not found");
      e.status = 404;
      throw e;
    }

    //
    // 1. Update menu metadata
    //
    await tx.clientMenu.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        type: data.type ?? existing.type,
        notes: data.notes ?? existing.notes,
        isActive: data.isActive ?? existing.isActive,
        startDate:
          data.startDate !== undefined
            ? data.startDate ? new Date(data.startDate) : null
            : existing.startDate,
        endDate:
          data.endDate !== undefined
            ? data.endDate ? new Date(data.endDate) : null
            : existing.endDate,
      },
    });

    //
    // 2. Meals CRUD
    //
    await deleteMeals(tx, id, data.mealsToDelete);
    await updateMeals(tx, id, data.mealsToUpdate);
    await addMealsFromTemplates(tx, id, data.mealsToAdd);

    //
    // 3. Recompute total calories
    //
    return recomputeMenuCalories(tx, id);
  });
};

const listClientMenus = async (query) => {
  const includeInactive = query.includeInactive === "true";

  return prisma.clientMenu.findMany({
    where: {
      ...(query.clientId && { clientId: query.clientId }),
      ...(query.coachId && { coachId: query.coachId }),
      ...(!includeInactive && { isActive: true }),
    },
    include: { meals: { include: { items: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getClientMenu = async (id) => {
  const menu = await prisma.clientMenu.findUnique({
    where: { id },
    include: { meals: { include: { items: true } } },
  });

  if (!menu) {
    const e = new Error("Client menu not found");
    e.status = 404;
    throw e;
  }

  return menu;
};

const deleteClientMenu = async (id) => {
  return prisma.clientMenu.update({
    where: { id },
    data: { isActive: false },
  });
};

module.exports = {
  createClientMenu,
  listClientMenus,
  getClientMenu,
  updateClientMenu,
  deleteClientMenu,
};
