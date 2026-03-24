// src/services/workoutTemplate.service.js
const { prisma } = require("../db/prisma");
const { AppError } = require("../common/errors");
const { localizeTemplate } = require("../common/workoutLocalization");

const listTemplates = async (filters = {}) => {
  const where = {};

  if (filters.gender) where.gender = filters.gender;
  if (filters.bodyType) where.bodyType = filters.bodyType;
  if (filters.workoutType) where.workoutType = filters.workoutType;
  if (filters.level) where.level = filters.level;

  const templates = await prisma.workoutTemplate.findMany({
    where,
    orderBy: { level: "asc" },
  });

  return templates.map(localizeTemplate);
};

const getTemplateById = async (id) => {
  const template = await prisma.workoutTemplate.findUnique({ where: { id } });
  if (!template) {
    throw new AppError(404, "Workout template not found");
  }
  return localizeTemplate(template);
};

const createTemplate = async (data, coachId) => {
  const created = await prisma.workoutTemplate.create({
    data: {
      gender: data.gender,
      level: data.level,
      bodyType: data.bodyType ?? null,
      workoutType: data.workoutType,
      muscleGroups: data.muscleGroups,
      name: data.name,
      notes: data.notes,
      createdByCoachId: coachId,
    },
  });

  return localizeTemplate(created);
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

  const updateData = {
    gender: data.gender ?? template.gender,
    level: data.level ?? template.level,
    bodyType: data.bodyType ?? template.bodyType,
    workoutType: data.workoutType ?? template.workoutType,
    muscleGroups: data.muscleGroups ?? template.muscleGroups,
    name: data.name ?? template.name,
    notes: data.notes ?? template.notes,
  };

  const updated = await prisma.workoutTemplate.update({
    where: { id },
    data: updateData,
  });

  return localizeTemplate(updated);
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
