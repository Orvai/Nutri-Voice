// src/services/exercise.service.js
const { prisma } = require("../db/prisma");
const { AppError } = require("../common/errors");
const {
  ExerciseCreateDto,
  ExerciseUpdateDto,
  ExerciseFilterDto,
} = require("../dto/exercise.dto");

const createExercise = async (data, coachId) => {
  const parsed = ExerciseCreateDto.parse(data);

  const exercise = await prisma.exercise.create({
    data: {
      ...parsed,
      createdByCoachId: coachId,
    },
  });

  return exercise;
};

const listExercises = async (filters = {}) => {
  const parsed = ExerciseFilterDto.parse(filters);

  const where = {};
  if (parsed.gender) where.gender = parsed.gender;
  if (parsed.bodyType) where.bodyType = parsed.bodyType;
  if (parsed.muscleGroup) where.muscleGroup = parsed.muscleGroup;
  if (parsed.workoutType) where.workoutTypes = { has: parsed.workoutType };

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
  if (exercise.createdByCoachId && exercise.createdByCoachId !== coachId) {
    throw new AppError(403, "Forbidden");
  }
};

const updateExercise = async (data, coachId) => {
  const parsed = ExerciseUpdateDto.parse(data);
  const exercise = await prisma.exercise.findUnique({ where: { id: parsed.id } });
  if (!exercise) {
    throw new AppError(404, "Exercise not found");
  }

  assertExerciseOwnership(exercise, coachId);

  return prisma.exercise.update({
    where: { id: parsed.id },
    data: {
      name: parsed.name ?? exercise.name,
      description: parsed.description ?? exercise.description,
      notes: parsed.notes ?? exercise.notes,
      videoUrl: parsed.videoUrl ?? exercise.videoUrl,
      muscleGroup: parsed.muscleGroup ?? exercise.muscleGroup,
      gender: parsed.gender ?? exercise.gender,
      bodyType: parsed.bodyType ?? exercise.bodyType,
      workoutTypes: parsed.workoutTypes ?? exercise.workoutTypes,
      equipment: parsed.equipment ?? exercise.equipment,
      difficulty: parsed.difficulty ?? exercise.difficulty,
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

module.exports = {
  createExercise,
  listExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
};