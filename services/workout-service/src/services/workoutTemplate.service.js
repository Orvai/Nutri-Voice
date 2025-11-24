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

module.exports = { listTemplates, getTemplateById };