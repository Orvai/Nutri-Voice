// src/services/workoutTemplate.service.js
const { prisma } = require("../db/prisma");
const { AppError } = require("../common/errors");

const listTemplates = async (filters = {}) => {
  const where = {};

  if (filters.gender) where.gender = filters.gender;
  if (filters.bodyType) where.bodyType = filters.bodyType;
  if (filters.workoutType) where.workoutType = filters.workoutType;
  if (filters.level) where.level = Number(filters.level);

  return prisma.workoutTemplate.findMany({
    where,
    orderBy: { level: "asc" },
  });
};

const getTemplateById = async (id) => {
  const template = await prisma.workoutTemplate.findUnique({ where: { id } });
  if (!template) {
    throw new AppError(404, "Workout template not found");
  }
  return template;
};

const createTemplate = async (data, coachId) => {
  return prisma.workoutTemplate.create({
    data: {
      ...data,
      createdByCoachId: coachId,
    },
  });
};

const updateTemplate = async (id, data, coachId) => {
  const template = await prisma.workoutTemplate.findUnique({ where: { id } });
  if (!template) {
    throw new AppError(404, "Workout template not found");
  }

  if (
    template.createdByCoachId &&
    template.createdByCoachId !== coachId
  ) {
    throw new AppError(403, "Forbidden");
  }

  return prisma.workoutTemplate.update({
    where: { id },
    data,
  });
};

const deleteTemplate = async (id, coachId) => {
  const template = await prisma.workoutTemplate.findUnique({ where: { id } });
  if (!template) {
    throw new AppError(404, "Workout template not found");
  }

  if (
    template.createdByCoachId &&
    template.createdByCoachId !== coachId
  ) {
    throw new AppError(403, "Forbidden");
  }

  await prisma.workoutTemplate.delete({ where: { id } });
};

module.exports = {
  listTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
