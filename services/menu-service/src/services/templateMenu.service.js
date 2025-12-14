// src/services/templateMenu.service.js
const prisma = require("../db/prisma");
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
              selectedOptionId: null,

              options: m.options
                ? {
                    create: m.options.map((opt, idx) => ({
                      name: opt.name,
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
              name: v.name ?? "",
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
                    include: {
                      foodItem: true,
                    },
                  },
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

  return created;
};

// =========================================================
// LIST Template Menus
// =========================================================
const listTemplateMenus = async (query) => {
  return prisma.templateMenu.findMany({
    where: {
      ...(query.coachId && { coachId: query.coachId }),
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
        include: {
          vitamin: true
        }
      },
      meals: {
        include: {
          options: {
            include: {
              mealTemplate: {
                include: {
                  items: {
                    include: {
                      foodItem: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!menu) {
    const e = new Error("Template menu not found");
    e.status = 404;
    throw e;
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
    const e = new Error("Template menu not found");
    e.status = 404;
    throw e;
  }

  await prisma.$transaction(async (tx) => {
    await tx.templateMenu.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        dayType: data.dayType ?? undefined,
        notes: data.notes ?? undefined,
        totalCalories: data.totalCalories ?? undefined,
      },
    });

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
          vitaminId: v.vitaminId,
          name: v.name,
          description: v.description ?? null,
        })),
      });
    }
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
        const createdMeal = await tx.templateMenuMeal.create({
          data: {
            templateMenuId: id,
            name: meal.name,
            totalCalories: meal.totalCalories ?? null,
            selectedOptionId: null,
          },
        });

        const mealTemplate = await tx.mealTemplate.create({
          data: {
            coachId: existing.coachId,
            name: meal.name,
            kind: "FREE_CALORIES",
            totalCalories: meal.totalCalories ?? 0,
          },
        });

        const option = await tx.templateMenuMealOption.create({
          data: {
            mealId: createdMeal.id,
            mealTemplateId: mealTemplate.id,
            name: meal.name,
            orderIndex: meal.orderIndex ?? 0,
          },
        });

        await tx.templateMenuMeal.update({
          where: { id: createdMeal.id },
          data: { selectedOptionId: option.id },
        });
      }
    }

    if (data.mealsToUpdate?.length) {
      for (const meal of data.mealsToUpdate) {
        await tx.templateMenuMeal.update({
          where: { id: meal.id },
          data: {
            name: meal.name ?? undefined,
            totalCalories: meal.totalCalories ?? undefined,
            selectedOptionId: meal.selectedOptionId ?? undefined,
          },
        });
      }
    }

    if (data.mealOptionsToDelete?.length) {
      await tx.templateMenuMealOption.deleteMany({
        where: { id: { in: data.mealOptionsToDelete.map((opt) => opt.id) } },
      });
    }

    if (data.mealOptionsToAdd?.length) {
      for (const option of data.mealOptionsToAdd) {
        let mealTemplateId = option.mealTemplateId;

        if (!mealTemplateId) {
          const newTemplate = await tx.mealTemplate.create({
            data: {
              coachId: existing.coachId,
              name: option.name ?? "אופציה חדשה",
              kind: "FREE_CALORIES",
              totalCalories: 0,
            },
          });

          mealTemplateId = newTemplate.id;
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

  // Always return fresh full menu (with nested structures)
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
