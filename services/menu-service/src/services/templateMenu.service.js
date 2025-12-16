// src/services/templateMenu.service.js

const prisma = require("../db/prisma");
const { createMealTemplate } = require("./mealTemplate.service");

const withStatus = (e, s = 400) => Object.assign(e, { status: s });

// =========================================================
// CREATE Template Menu
// =========================================================
const createTemplateMenu = async (data, coachId) => {
  const created = await prisma.templateMenu.create({
    data: {
      coachId,
      name: data.name,
      dayType: data.dayType,
      notes: data.notes ?? null,

      meals: data.meals
        ? {
            create: data.meals.map((m) => ({
              name: m.name,
              notes: m.notes ?? null,
              totalCalories: m.totalCalories ?? 0,

              options: m.options
                ? {
                    create: m.options.map((opt, idx) => ({
                      name: opt.name ?? null,
                      orderIndex: opt.orderIndex ?? idx,
                      mealTemplateId: opt.mealTemplateId,
                    })),
                  }
                : undefined,
            })),
          }
        : undefined,

      vitamins: data.vitamins
        ? {
            create: data.vitamins.map((v) => ({
              vitaminId: v.vitaminId ?? null,
              name: v.name,
              description: v.description ?? null,
            })),
          }
        : undefined,
    },
    include: {
      meals: {
        include: {
          options: {
            include: {
              mealTemplate: {
                include: {
                  items: {
                    include: { foodItem: true },
                  },
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

  return created;
};

// =========================================================
// LIST Template Menus
// =========================================================
const listTemplateMenus = async ({ coachId }) => {
  return prisma.templateMenu.findMany({
    where: {
      ...(coachId && { coachId }),
    },
    select: {
      id: true,
      name: true,
      dayType: true,
      totalCalories: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// =========================================================
// GET Template Menu by ID
// =========================================================
const getTemplateMenu = async (id) => {
  const menu = await prisma.templateMenu.findUnique({
    where: { id },
    include: {
      vitamins: {
        include: { vitamin: true },
      },
      meals: {
        include: {
          options: {
            include: {
              mealTemplate: {
                include: {
                  items: {
                    include: { foodItem: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!menu) {
    throw withStatus(new Error("Template menu not found"), 404);
  }

  return menu;
};

// =========================================================
// UPDATE Template Menu
// =========================================================
const updateTemplateMenu = async (id, data) => {
  const existing = await prisma.templateMenu.findUnique({
    where: { id },
    select: { coachId: true },
  });

  if (!existing) {
    throw withStatus(new Error("Template menu not found"), 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.templateMenu.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        dayType: data.dayType ?? undefined,
        notes: data.notes ?? undefined,
      },
    });

    // Vitamins
    if (data.vitaminsToDelete?.length) {
      await tx.templateMenuVitamin.deleteMany({
        where: {
          id: { in: data.vitaminsToDelete.map((v) => v.id) },
          templateMenuId: id,
        },
      });
    }

    if (data.vitaminsToAdd?.length) {
      await tx.templateMenuVitamin.createMany({
        data: data.vitaminsToAdd.map((v) => ({
          templateMenuId: id,
          vitaminId: v.vitaminId ?? null,
          name: v.name,
          description: v.description ?? null,
        })),
      });
    }

    // Meals
    if (data.mealsToDelete?.length) {
      await tx.templateMenuMeal.deleteMany({
        where: {
          id: { in: data.mealsToDelete.map((m) => m.id) },
          templateMenuId: id,
        },
      });
    }

    if (data.mealsToAdd?.length) {
      for (const meal of data.mealsToAdd) {
        await tx.templateMenuMeal.create({
          data: {
            templateMenuId: id,
            name: meal.name,
            notes: meal.notes ?? null,
            totalCalories: meal.totalCalories ?? 0,
          },
        });
      }
    }

    if (data.mealsToUpdate?.length) {
      for (const meal of data.mealsToUpdate) {
        await tx.templateMenuMeal.update({
          where: { id: meal.id },
          data: {
            name: meal.name ?? undefined,
            notes: meal.notes ?? undefined,
            totalCalories: meal.totalCalories ?? undefined,
          },
        });
      }
    }

    // Meal Options
    if (data.mealOptionsToDelete?.length) {
      await tx.templateMenuMealOption.deleteMany({
        where: {
          id: { in: data.mealOptionsToDelete.map((o) => o.id) },
        },
      });
    }

    if (data.mealOptionsToAdd?.length) {
      for (const option of data.mealOptionsToAdd) {
        let mealTemplateId = option.mealTemplateId;

        if (!mealTemplateId) {
          if (!option.template) {
            throw withStatus(
              new Error("template is required when mealTemplateId is missing"),
              400
            );
          }

          const createdTemplate = await createMealTemplate(
            {
              name: option.template.name,
              kind: option.template.kind ?? "FREE_CALORIES",
              items: option.template.items ?? [],
            },
            existing.coachId
          );

          mealTemplateId = createdTemplate.id;
        }

        await tx.templateMenuMealOption.create({
          data: {
            mealId: option.mealId,
            mealTemplateId,
            name: option.name ?? null,
            orderIndex: option.orderIndex ?? 0,
          },
        });
      }
    }

    // Recompute menu total calories
    const meals = await tx.templateMenuMeal.findMany({
      where: { templateMenuId: id },
      select: { totalCalories: true },
    });

    const totalCalories = meals.reduce(
      (sum, meal) => sum + (meal.totalCalories ?? 0),
      0
    );

    await tx.templateMenu.update({
      where: { id },
      data: { totalCalories },
    });
  });

  return getTemplateMenu(id);
};

// =========================================================
// DELETE Template Menu
// =========================================================
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
