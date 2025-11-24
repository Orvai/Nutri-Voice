// src/services/mealTemplate.service.js
const prisma = require("../db/prisma");
const {MealTemplateCreateRequestDto,MealTemplateUpdateRequestDto,} = require("../dto/mealTemplate.dto");

const computeDefaultCalories = (foodItem, grams) => {
  if (grams === undefined || grams === null) {
    return null;
  }

  return (foodItem.caloriesPer100g / 100) * grams;
};

const prepareItems = async (items) => {
  if (!items || items.length === 0) {
    return [];
  }

  const preparedItems = [];

  for (const item of items) {
    const foodItem = await prisma.foodItem.findUnique({
      where: { id: item.foodItemId },
    });

    if (!foodItem) {
      const error = new Error(`FoodItem not found: ${item.foodItemId}`);
      error.status = 400;
      throw error;
    }

    preparedItems.push({
      foodItemId: item.foodItemId,
      role: item.role,
      defaultGrams: item.defaultGrams,
      defaultCalories: computeDefaultCalories(foodItem, item.defaultGrams),
      notes: item.notes,
    });
  }

  return preparedItems;
};

const createMealTemplate = async (payload, coachId) => {
  const data = MealTemplateCreateRequestDto.parse(payload);

  const items = await prepareItems(data.items);

  return prisma.mealTemplate.create({
    data: {
      name: data.name,
      kind: data.kind,
      coachId,
      items: items.length ? { create: items } : undefined,
    },
    include: { items: true },
  });
};

const listMealTemplates = async (query) => {
  return prisma.mealTemplate.findMany({
    where: {
      ...(query.kind && { kind: query.kind }),
      ...(query.coachId && { coachId: query.coachId }),
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
};

const getMealTemplate = async (id) => {
  const template = await prisma.mealTemplate.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!template) {
    const error = new Error("Meal template not found");
    error.status = 404;
    throw error;
  }

  return template;
};

const upsertMealTemplate = async (id, payload) => {
  const data = MealTemplateUpdateRequestDto.parse(payload);

  // שליפת התבנית הקיימת
  const existing = await prisma.mealTemplate.findUnique({
    where: { id },
  });

  if (!existing) {
    const error = new Error("Meal template not found");
    error.status = 404;
    throw error;
  }

  // --------------------------
  // UPDATE TEMPLATE ITSELF
  // --------------------------
  await prisma.mealTemplate.update({
    where: { id },
    data: {
      name: data.name ?? existing.name,
      kind: data.kind ?? existing.kind,
      totalCalories: data.totalCalories ?? existing.totalCalories,
    },
  });

  // --------------------------
  // 1. DELETE ITEMS
  // --------------------------
  if (data.itemsToDelete && data.itemsToDelete.length > 0) {
    const idsToDelete = data.itemsToDelete.map((i) => i.id);

    await prisma.mealTemplateItem.deleteMany({
      where: {
        id: { in: idsToDelete },
        mealTemplateId: id,
      },
    });
  }

  // --------------------------
  // 2. UPDATE ITEMS
  // --------------------------
  if (data.itemsToUpdate && data.itemsToUpdate.length > 0) {
    for (const item of data.itemsToUpdate) {
      await prisma.mealTemplateItem.update({
        where: { id: item.id },
        data: {
          foodItemId: item.foodItemId ?? undefined,
          role: item.role ?? undefined,
          defaultGrams: item.defaultGrams ?? undefined,
          defaultCalories: item.defaultCalories ?? undefined,
          notes: item.notes ?? undefined,
        },
      });
    }
  }

  // --------------------------
  // 3. ADD ITEMS
  // --------------------------
  if (data.itemsToAdd && data.itemsToAdd.length > 0) {
    const itemsToCreate = await prepareItems(data.itemsToAdd);

    await prisma.mealTemplateItem.createMany({
      data: itemsToCreate.map((item) => ({
        ...item,
        mealTemplateId: id,
      })),
    });
  }

  // --------------------------
  // RETURN UPDATED TEMPLATE
  // --------------------------
  return getMealTemplate(id);
};

const deleteMealTemplate = async (id) => {
  return prisma.mealTemplate.delete({
    where: { id },
  });
};

module.exports = {
  createMealTemplate,
  listMealTemplates,
  getMealTemplate,
  upsertMealTemplate,
  deleteMealTemplate,
  computeDefaultCalories,
}; 
