// src/services/mealTemplate.service.js
const prisma = require("../db/prisma");
const {
  MealTemplateCreateRequestDto,
  MealTemplateUpdateRequestDto,
  MealTemplateItemInputDto,
} = require("../dto/mealTemplate.dto");

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

  const items = data.items ? await prepareItems(data.items) : undefined;

  const existing = await prisma.mealTemplate.findUnique({ where: { id } });

  if (existing) {
    if (data.items) {
      await prisma.mealTemplateItem.deleteMany({
        where: { mealTemplateId: id },
      });
    }

    return prisma.mealTemplate.update({
      where: { id },
      data: {
        name: data.name,
        kind: data.kind,
        items: data.items
          ? items.length
            ? {
                create: items,
              }
            : undefined
          : undefined,
      },
      include: { items: true },
    });
  }

  return prisma.mealTemplate.create({
    data: {
      id,
      name: data.name,
      kind: data.kind,
      items: items?.length
        ? {
            create: items,
          }
        : undefined,
    },
    include: { items: true },
  });
};

const addItemToTemplate = async (templateId, payload) => {
  const data = MealTemplateItemInputDto.parse(payload);

  const template = await prisma.mealTemplate.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    const error = new Error("Meal template not found");
    error.status = 404;
    throw error;
  }

  const [item] = await prepareItems([data]);

  await prisma.mealTemplateItem.create({
    data: {
      ...item,
      mealTemplateId: templateId,
    },
  });

  return getMealTemplate(templateId);
};

const removeItemFromTemplate = async (templateId, itemId) => {
  const existing = await prisma.mealTemplateItem.findFirst({
    where: { id: itemId, mealTemplateId: templateId },
  });

  if (!existing) {
    const error = new Error("Meal template item not found");
    error.status = 404;
    throw error;
  }

  await prisma.mealTemplateItem.delete({ where: { id: itemId } });

  return getMealTemplate(templateId);
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
  addItemToTemplate,
  removeItemFromTemplate,
  computeDefaultCalories,
}; 
