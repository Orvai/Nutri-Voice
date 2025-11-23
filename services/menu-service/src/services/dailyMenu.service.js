// src/services/dailyMenu.service.js
const prisma = require("../db/prisma");
const {
  DailyMenuTemplateCreateRequestDto,
  DailyMenuTemplateUpdateRequestDto,
} = require("../dto/dailyMenu.dto");

const createDailyMenuTemplate = async (payload, coachId) => {
  const data = DailyMenuTemplateCreateRequestDto.parse(payload);

  return prisma.dailyMenuTemplate.create({
    data: {
      name: data.name,
      dayType: data.dayType,
      coachId,
      meals: {
        create: data.meals.map((m) => ({
          slot: m.slot,
          maxCalories: m.maxCalories,
          mealTemplateId: m.mealTemplateId,
          notes: m.notes,
        })),
      },
    },
    include: { meals: true },
  });
};

const listDailyMenuTemplates = async (query) => {
  return prisma.dailyMenuTemplate.findMany({
    where: {
      ...(query.dayType && { dayType: query.dayType }),
      ...(query.coachId && { coachId: query.coachId }),
    },
    include: {
      meals: {
        include: {
          mealTemplate: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getDailyMenuTemplate = async (id) => {
  const template = await prisma.dailyMenuTemplate.findUnique({
    where: { id },
    include: {
      meals: {
        include: {
          mealTemplate: true,
        },
      },
    },
  });

  if (!template) {
    const error = new Error("Daily menu template not found");
    error.status = 404;
    throw error;
  }

  return template;
};

const upsertDailyMenuTemplate = async (id, payload) => {
  const data = DailyMenuTemplateUpdateRequestDto.parse(payload);
  const existing = await prisma.dailyMenuTemplate.findUnique({ where: { id } });

  if (existing) {
    if (data.meals) {
      await prisma.dailyMenuMeal.deleteMany({
        where: { dailyMenuTemplateId: id },
      });
    }

    return prisma.dailyMenuTemplate.update({
      where: { id },
      data: {
        name: data.name,
        dayType: data.dayType,
        meals: data.meals
          ? {
              create: data.meals.map((m) => ({
                slot: m.slot,
                maxCalories: m.maxCalories,
                mealTemplateId: m.mealTemplateId,
                notes: m.notes,
              })),
            }
          : undefined,
      },
      include: { meals: true },
    });
  }

  return prisma.dailyMenuTemplate.create({
    data: {
      id,
      name: data.name,
      dayType: data.dayType,
      meals: data.meals
        ? {
            create: data.meals.map((m) => ({
              slot: m.slot,
              maxCalories: m.maxCalories,
              mealTemplateId: m.mealTemplateId,
              notes: m.notes,
            })),
          }
        : undefined,
    },
    include: { meals: true },
  });
};

const deleteDailyMenuTemplate = async (id) => {
  return prisma.dailyMenuTemplate.delete({
    where: { id },
  });
};

module.exports = {
  createDailyMenuTemplate,
  listDailyMenuTemplates,
  getDailyMenuTemplate,
  upsertDailyMenuTemplate,
  deleteDailyMenuTemplate,
};
