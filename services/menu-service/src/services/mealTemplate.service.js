const prisma = require("../db/prisma");
const {
  TemplateMenuCreateDto,
  TemplateMenuUpdateDto,
} = require("../dto/templateMenu.dto");

// ------------ Create Template Menu ------------
const createTemplateMenu = async (payload) => {
  const data = TemplateMenuCreateDto.parse(payload);

  return prisma.templateMenu.create({
    data: {
      coachId: data.coachId,
      name: data.name,
      dayType: data.dayType,
      notes: data.notes ?? null,

      meals: data.meals
        ? {
            create: data.meals.map((meal) => ({
              name: meal.name,
              selectedOptionId: meal.selectedOptionId ?? null,
              options: {
                create: meal.options.map((opt) => ({
                  mealTemplateId: opt.mealTemplateId,
                  name: opt.name ?? null,
                  orderIndex: opt.orderIndex ?? 0,
                })),
              },
            })),
          }
        : undefined,

      vitamins: data.vitamins
        ? {
            create: data.vitamins.map((v) => ({
              name: v.name,
              description: v.description ?? null,
            })),
          }
        : undefined,
    },

    include: {
      meals: { include: { options: true } },
      vitamins: true,
    },
  });
};

// ------------ List ------------
const listTemplateMenus = async (query) => {
  return prisma.templateMenu.findMany({
    where: {
      ...(query.coachId && { coachId: query.coachId }),
    },
    include: {
      meals: { include: { options: true } },
      vitamins: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// ------------ Get by ID ------------
const getTemplateMenu = async (id) => {
  const menu = await prisma.templateMenu.findUnique({
    where: { id },
    include: {
      meals: { include: { options: true } },
      vitamins: true,
    },
  });
  if (!menu) {
    const e = new Error("Template menu not found");
    e.status = 404;
    throw e;
  }
  return menu;
};

// ------------ Update Template Menu ------------
const updateTemplateMenu = async (id, payload) => {
  const data = TemplateMenuUpdateDto.parse(payload);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.templateMenu.findUnique({ where: { id } });
    if (!existing) {
      const e = new Error("Template menu not found");
      e.status = 404;
      throw e;
    }

    // --- update basic fields ---
    await tx.templateMenu.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        dayType: data.dayType ?? existing.dayType,
        notes: data.notes ?? existing.notes,
      },
    });

    // ========== Meals ==========
    if (data.mealsToDelete?.length) {
      const ids = data.mealsToDelete.map((m) => m.id);
      await tx.templateMenuMeal.deleteMany({
        where: { id: { in: ids }, templateMenuId: id },
      });
    }

    if (data.mealsToUpdate?.length) {
      for (const meal of data.mealsToUpdate) {
        // update meal basic fields
        await tx.templateMenuMeal.update({
          where: { id: meal.id },
          data: {
            name: meal.name ?? undefined,
            selectedOptionId: meal.selectedOptionId ?? undefined,
          },
        });

        // options delete
        if (meal.optionsToDelete?.length) {
          const optIds = meal.optionsToDelete.map((o) => o.id);
          await tx.templateMenuMealOption.deleteMany({
            where: { id: { in: optIds }, mealId: meal.id },
          });
        }

        // options update
        if (meal.optionsToUpdate?.length) {
          for (const opt of meal.optionsToUpdate) {
            await tx.templateMenuMealOption.update({
              where: { id: opt.id },
              data: {
                mealTemplateId: opt.mealTemplateId ?? undefined,
                name: opt.name ?? undefined,
                orderIndex: opt.orderIndex ?? undefined,
              },
            });
          }
        }

        // options add
        if (meal.optionsToAdd?.length) {
          await tx.templateMenuMealOption.createMany({
            data: meal.optionsToAdd.map((opt) => ({
              mealId: meal.id,
              mealTemplateId: opt.mealTemplateId,
              name: opt.name ?? null,
              orderIndex: opt.orderIndex ?? 0,
            })),
          });
        }
      }
    }

    if (data.mealsToAdd?.length) {
      for (const meal of data.mealsToAdd) {
        const createdMeal = await tx.templateMenuMeal.create({
          data: {
            templateMenuId: id,
            name: meal.name,
            selectedOptionId: meal.selectedOptionId ?? null,
          },
        });

        if (meal.options?.length) {
          await tx.templateMenuMealOption.createMany({
            data: meal.options.map((opt) => ({
              mealId: createdMeal.id,
              mealTemplateId: opt.mealTemplateId,
              name: opt.name ?? null,
              orderIndex: opt.orderIndex ?? 0,
            })),
          });
        }
      }
    }

    // ========== Vitamins ==========
    if (data.vitaminsToDelete?.length) {
      const ids = data.vitaminsToDelete.map((v) => v.id);
      await tx.templateMenuVitamin.deleteMany({
        where: { id: { in: ids }, templateMenuId: id },
      });
    }

    if (data.vitaminsToUpdate?.length) {
      for (const v of data.vitaminsToUpdate) {
        await tx.templateMenuVitamin.update({
          where: { id: v.id },
          data: {
            name: v.name ?? undefined,
            description: v.description ?? undefined,
          },
        });
      }
    }

    if (data.vitaminsToAdd?.length) {
      await tx.templateMenuVitamin.createMany({
        data: data.vitaminsToAdd.map((v) => ({
          templateMenuId: id,
          name: v.name,
          description: v.description ?? null,
        })),
      });
    }

    return getTemplateMenu(id);
  });
};

// ------------ Delete ------------
const deleteTemplateMenu = async (id) => {
  return prisma.templateMenu.delete({
    where: { id },
  });
};

module.exports = {
  createTemplateMenu,
  listTemplateMenus,
  getTemplateMenu,
  updateTemplateMenu,
  deleteTemplateMenu,
};
