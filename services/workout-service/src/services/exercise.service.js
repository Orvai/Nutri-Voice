// src/services/exercise.service.js
const fs = require("fs/promises");
const path = require("path");
const { prisma } = require("../db/prisma");
const { AppError } = require("../common/errors");
const { localizeExercise } = require("../common/workoutLocalization");
const { videoDir } = require("../middleware/videoUpload");

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

  return localizeExercise(exercise);
};

const listExercises = async (filters = {}) => {
  const where = {};
  if (filters.gender) where.gender = filters.gender;
  if (filters.bodyType) where.bodyType = filters.bodyType;
  if (filters.muscleGroup) where.muscleGroup = filters.muscleGroup;
  if (filters.workoutType) where.workoutTypes = { has: filters.workoutType };

  const exercises = await prisma.exercise.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return exercises.map(localizeExercise);
};

const getExerciseById = async (id) => {
  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) {
    throw new AppError(404, "Exercise not found");
  }
  return localizeExercise(exercise);
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

const resolveUploadedVideoFileName = (videoUrl) => {
  if (typeof videoUrl !== "string" || !videoUrl.trim()) {
    return null;
  }

  const raw = videoUrl.trim();
  let pathname = raw;

  try {
    pathname = new URL(raw).pathname;
  } catch (_error) {
    pathname = raw;
  }

  if (!pathname.startsWith("/uploads/videos/")) {
    return null;
  }

  const fileName = path.basename(pathname);
  return fileName || null;
};

const removeUploadedVideoFile = async (videoUrl) => {
  const fileName = resolveUploadedVideoFileName(videoUrl);
  if (!fileName) {
    return;
  }

  const filePath = path.join(videoDir, fileName);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.warn("Failed to delete uploaded video file", {
        filePath,
        error: error?.message,
      });
    }
  }
};

const updateExercise = async (id, data, coachId) => {
  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) {
    throw new AppError(404, "Exercise not found");
  }

  assertExerciseOwnership(exercise, coachId);

  const updated = await prisma.exercise.update({
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

  return localizeExercise(updated);
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

  const updated = await prisma.exercise.update({
    where: { id },
    data: { videoUrl },
  });

  if (exercise.videoUrl && exercise.videoUrl !== videoUrl) {
    await removeUploadedVideoFile(exercise.videoUrl);
  }

  return localizeExercise(updated);
};

const clearExerciseVideo = async ({ id, coachId }) => {
  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) {
    throw new AppError(404, "Exercise not found");
  }

  assertExerciseOwnership(exercise, coachId);

  if (!exercise.videoUrl) {
    return localizeExercise(exercise);
  }

  const updated = await prisma.exercise.update({
    where: { id },
    data: { videoUrl: null },
  });

  await removeUploadedVideoFile(exercise.videoUrl);

  return localizeExercise(updated);
};

module.exports = {
  createExercise,
  listExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
  saveExerciseVideo,
  clearExerciseVideo,
};
