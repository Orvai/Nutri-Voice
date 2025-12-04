const prisma = require("../db/prisma");
const {
  MealTemplateCreateDto,
  MealTemplateUpsertDto, // update DTO
} = require("../dto/mealTemplate.dto");

// =========================================================
// CREATE Meal Template
// =========================================================
const createMealTemplate = async (payload) => {
  const data = MealTemplateCreateDto.parse(payload);

  const created = await prisma.mealTemplate.create({
    data: {
      coachId: data.coachId,
      name: data.name,
      kind: data.kind,
      totalCalories: data.totalCalories ?? 0,

      items: data.items
        ? {
            create: data.items.map((item) => ({
              foodItemId: item.foodItemId,
              role: item.role,
              defaultGrams: item.defaultGrams ?? 100,
              defaultCalories: item.defaultCalories ?? null,
              notes: item.notes ?? null,
            })),
          }
        : undefined,
    },

    include: {
      items: { include: { foodItem: true } },
      templateMealOptions: true,
      clientMealOptions: true,
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
      items: { include: { foodItem: true } },

      templateMealOptions: {
        include: {
          meal: true,
        },
      },
      clientMealOptions: true,
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
// UPDATE Meal Template (Upsert style)
// =========================================================
const updateMealTemplate = async (id, payload) => {
  const data = MealTemplateUpsertDto.parse(payload);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.mealTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      const e = new Error("Meal template not found");
      e.status = 404;
      throw e;
    }

    // --- Update basic fields ---
    await tx.mealTemplate.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        kind: data.kind ?? existing.kind,
        totalCalories: data.totalCalories ?? existing.totalCalories,
      },
    });

    // ========== DELETE items ==========
    if (data.itemsToDelete?.length) {
      await tx.mealTemplateItem.deleteMany({
        where: {
          id: { in: data.itemsToDelete.map((i) => i.id) },
          mealTemplateId: id,
        },
      });
    }

    // ========== UPDATE items ==========
    if (data.itemsToUpdate?.length) {
      for (const item of data.itemsToUpdate) {
        await tx.mealTemplateItem.update({
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

    // ========== ADD items ==========
    if (data.itemsToAdd?.length) {
      await tx.mealTemplateItem.createMany({
        data: data.itemsToAdd.map((item) => ({
          mealTemplateId: id,
          foodItemId: item.foodItemId,
          role: item.role,
          defaultGrams: item.defaultGrams ?? 100,
          defaultCalories: item.defaultCalories ?? null,
          notes: item.notes ?? null,
        })),
      });
    }

    // Return updated template
    return getMealTemplate(id);
  });
};

// =========================================================
// DELETE Template
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
