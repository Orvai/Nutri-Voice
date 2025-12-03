// src/services/templateMenu.service.js
const prisma = require("../db/prisma");
const {
  TemplateMenuCreateDto,
  TemplateMenuUpdateDto,
} = require("../dto/templateMenu.dto");

// =========================================================
// CREATE Template Menu
// =========================================================
const createTemplateMenu = async (payload) => {
  const data = TemplateMenuCreateDto.parse(payload);

  const created = await prisma.templateMenu.create({
    data: {
      coachId: data.coachId,
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
              name: v.name,
              description: v.description ?? null,
            })),
          }
        : undefined,
    },

    include: {
      meals: {
        include: {
          options: true,
        },
      },
      vitamins: true,
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
    include: {
      meals: {
        include: {
          options: true, // ← הכי חשוב!!
        },
      },
      vitamins: true,
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
      meals: {
        include: {
          options: true,
        },
      },
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

// =========================================================
// UPDATE Template Menu
// =========================================================
const updateTemplateMenu = async (id, payload) => {
  const data = TemplateMenuUpdateDto.parse(payload);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.templateMenu.findUnique({
      where: { id },
    });

    if (!existing) {
      const e = new Error("Template menu not found");
      e.status = 404;
      throw e;
    }

    // ------------ Update basic fields ------------
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
      await tx.templateMenuMeal.deleteMany({
        where: {
          id: { in: data.mealsToDelete.map((m) => m.id) },
          templateMenuId: id,
        },
      });
    }

    if (data.mealsToUpdate?.length) {
      for (const m of data.mealsToUpdate) {
        await tx.templateMenuMeal.update({
          where: { id: m.id },
          data: {
            name: m.name ?? undefined,
            selectedOptionId: m.selectedOptionId ?? undefined,
          },
        });
      }
    }

    if (data.mealsToAdd?.length) {
      for (const m of data.mealsToAdd) {
        await tx.templateMenuMeal.create({
          data: {
            templateMenuId: id,
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
          },
        });
      }
    }

    // ========== Vitamins ==========
    if (data.vitaminsToDelete?.length) {
      await tx.templateMenuVitamin.deleteMany({
        where: {
          id: { in: data.vitaminsToDelete.map((v) => v.id) },
          templateMenuId: id,
        },
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

    // Return updated menu
    return getTemplateMenu(id);
  });
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
