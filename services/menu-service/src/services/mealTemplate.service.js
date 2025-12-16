// src/services/mealTemplate.service.js

const prisma = require("../db/prisma");

// =========================================================
// CREATE Meal Template
// =========================================================
const createMealTemplate = async (data, coachId) => {
  const created = await prisma.mealTemplate.create({
    data: {
      coachId,
      name: data.name,
      kind: data.kind,

      items: data.items
        ? {
            create: data.items.map((item) => ({
              foodItemId: item.foodItemId,
              role: item.role,
              grams: item.grams ?? 100,
            })),
          }
        : undefined,
    },
    include: {
      items: {
        include: { foodItem: true },
      },
    },
  });

  return created;
};

// =========================================================
// LIST Meal Templates
// =========================================================
const listMealTemplates = async (query) => {
  return prisma.mealTemplate.findMany({
    where: {
      ...(query.coachId && { coachId: query.coachId }),
    },
    include: {
      items: {
        include: { foodItem: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// =========================================================
// GET Meal Template by ID
// =========================================================
const getMealTemplate = async (id) => {
  const template = await prisma.mealTemplate.findUnique({
    where: { id },
    include: {
      items: {
        include: { foodItem: true },
      },
    },
  });

  if (!template) {
    const e = new Error("Meal template not found");
    e.status = 404;
    throw e;
  }

  return template;
};

// =========================================================
// UPDATE Meal Template
// =========================================================
const updateMealTemplate = async (id, data) => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.mealTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      const e = new Error("Meal template not found");
      e.status = 404;
      throw e;
    }

    await tx.mealTemplate.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        kind: data.kind ?? undefined,
      },
    });

    if (data.itemsToDelete?.length) {
      await tx.mealTemplateItem.deleteMany({
        where: {
          id: { in: data.itemsToDelete.map((i) => i.id) },
          mealTemplateId: id,
        },
      });
    }

    if (data.itemsToUpdate?.length) {
      for (const item of data.itemsToUpdate) {
        await tx.mealTemplateItem.update({
          where: { id: item.id },
          data: {
            foodItemId: item.foodItemId ?? undefined,
            role: item.role ?? undefined,
            grams: item.grams ?? undefined,
          },
        });
      }
    }

    if (data.itemsToAdd?.length) {
      await tx.mealTemplateItem.createMany({
        data: data.itemsToAdd.map((item) => ({
          mealTemplateId: id,
          foodItemId: item.foodItemId,
          role: item.role,
          grams: item.grams ?? 100,
        })),
      });
    }

    return getMealTemplate(id);
  });
};

// =========================================================
// DELETE Meal Template
// =========================================================
const deleteMealTemplate = async (id) => {
  return prisma.mealTemplate.delete({
    where: { id },
  });
};

module.exports = {
  createMealTemplate,
  listMealTemplates,
  getMealTemplate,
  updateMealTemplate,
  deleteMealTemplate,
};
 