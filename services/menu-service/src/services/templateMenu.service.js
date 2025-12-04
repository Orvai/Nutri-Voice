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
const updateTemplateMenu = async (id, payload) => {
  const data = TemplateMenuUpdateDto.parse(payload);

  const updated = await prisma.templateMenu.update({
    where: { id },
    data: {
      name: data.name ?? undefined,
      dayType: data.dayType ?? undefined,
      notes: data.notes ?? undefined,
      totalCalories: data.totalCalories ?? undefined
    }
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
