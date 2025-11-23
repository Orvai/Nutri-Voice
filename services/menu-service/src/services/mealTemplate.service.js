// src/services/mealTemplate.service.js
const prisma = require("../db/prisma");
const {
  MealTemplateCreateRequestDto,
  MealTemplateUpdateRequestDto,
} = require("../dto/mealTemplate.dto");

const validateFoodItemsExist = async (items) => {
  for (const item of items) {
    const exists = await prisma.foodItem.findUnique({
      where: { id: item.foodItemId },
    });
    if (!exists) {
      const error = new Error(`FoodItem not found: ${item.foodItemId}`);
      error.status = 400;
      throw error;
    }
  }
};

const createMealTemplate = async (payload, coachId) => {
  const data = MealTemplateCreateRequestDto.parse(payload);

  await validateFoodItemsExist(data.items);

  return prisma.mealTemplate.create({
    data: {
      name: data.name,
      kind: data.kind,
      coachId,
      items: {
        create: data.items.map((i) => ({
          foodItemId: i.foodItemId,
          role: i.role,
          defaultGrams: i.defaultGrams,
          defaultCalories: i.defaultCalories,
          notes: i.notes,
        })),
      },
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

  if (data.items) {
    await validateFoodItemsExist(data.items);
  }

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
          ? {
              create: data.items.map((i) => ({
                foodItemId: i.foodItemId,
                role: i.role,
                defaultGrams: i.defaultGrams,
                defaultCalories: i.defaultCalories,
                notes: i.notes,
              })),
            }
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
      items: data.items
        ? {
            create: data.items.map((i) => ({
              foodItemId: i.foodItemId,
              role: i.role,
              defaultGrams: i.defaultGrams,
              defaultCalories: i.defaultCalories,
              notes: i.notes,
            })),
          }
        : undefined,
    },
    include: { items: true },
  });
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
};
