// src/services/exercise.service.js
const { prisma } = require("../db/prisma");
const { AppError } = require("../common/errors");

const createExercise = async (data, coachId) => {
  const exercise = await prisma.exercise.create({
    data: {
      name: data.name,
      description: data.description,
      notes: data.notes,
      videoUrl: data.videoUrl,
      muscleGroup: data.muscleGroup,
      gender: data.gender,
      bodyType: data.bodyType,
      workoutTypes: data.workoutTypes,
      equipment: data.equipment,
      difficulty: data.difficulty,
      createdByCoachId: coachId,
    },
  });

  return exercise;
};

const listExercises = async (filters = {}) => {
  const where = {};
  if (filters.gender) where.gender = filters.gender;
  if (filters.bodyType) where.bodyType = filters.bodyType;
  if (filters.muscleGroup) where.muscleGroup = filters.muscleGroup;
  if (filters.workoutType) where.workoutTypes = { has: filters.workoutType };

  return prisma.exercise.findMany({
    where,
    orderBy: { name: "asc" },
  });
};

const getExerciseById = async (id) => {
  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) {
    throw new AppError(404, "Exercise not found");
  }
  return exercise;
};

const assertExerciseOwnership = (exercise, coachId) => {
  if (
    coachId &&
    exercise.createdByCoachId &&
    exercise.createdByCoachId !== coachId
  ) {
    throw new AppError(403, "Forbidden");
  }
};

const updateExercise = async (id, data, coachId) => {
  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) {
    throw new AppError(404, "Exercise not found");
  }

  assertExerciseOwnership(exercise, coachId);

  return prisma.exercise.update({
    where: { id },
    data: {
      name: data.name ?? exercise.name,
      description: data.description ?? exercise.description,
      notes: data.notes ?? exercise.notes,
      videoUrl: data.videoUrl ?? exercise.videoUrl,
      muscleGroup: data.muscleGroup ?? exercise.muscleGroup,
      gender: data.gender ?? exercise.gender,
      bodyType: data.bodyType ?? exercise.bodyType,
      workoutTypes: data.workoutTypes ?? exercise.workoutTypes,
      equipment: data.equipment ?? exercise.equipment,
      difficulty: data.difficulty ?? exercise.difficulty,
    },
  });
};

const deleteExercise = async (id, coachId) => {
  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) {
    throw new AppError(404, "Exercise not found");
  }

  assertExerciseOwnership(exercise, coachId);

  await prisma.exercise.delete({ where: { id } });
};
const saveExerciseVideo = async ({ id, videoUrl, coachId }) => {
  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) {
    throw new AppError(404, "Exercise not found");
  }

  assertExerciseOwnership(exercise, coachId);

  return prisma.exercise.update({
    where: { id },
    data: { videoUrl },
  });
};

module.exports = {
  createExercise,
  listExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
  saveExerciseVideo,
};
