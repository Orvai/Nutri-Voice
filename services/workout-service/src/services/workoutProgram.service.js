// src/services/workoutProgram.service.js
const { prisma } = require("../db/prisma");
const { AppError } = require("../common/errors");
const {
  WorkoutProgramCreateRequestDto,
  WorkoutProgramUpdateRequestDto,
} = require("../dto/workoutProgram.dto");

const createProgram = async (data) => {
  const parsed = WorkoutProgramCreateRequestDto.parse(data);

  return prisma.$transaction(async (tx) => {
    const program = await tx.workoutProgram.create({
      data: {
        name: parsed.name,
        clientId: parsed.clientId,
        coachId: parsed.coachId,
      },
    });

    if (parsed.exercises && parsed.exercises.length > 0) {
      await tx.workoutExercise.createMany({
        data: parsed.exercises.map((ex) => ({
          programId: program.id,
          exerciseId: ex.exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight ?? null,
          rest: ex.rest ?? null,
          order: ex.order,
          notes: ex.notes ?? null,
        })),
      });
    }

    return tx.workoutProgram.findUnique({
      where: { id: program.id },
      include: { exercises: { orderBy: { order: "asc" } } },
    });
  });
};

const listPrograms = async (filters = {}) => {
  const where = {};

  if (filters.clientId) {
    where.clientId = filters.clientId;
  }

  if (filters.coachId) {
    where.coachId = filters.coachId;
  }

  return prisma.workoutProgram.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { exercises: { orderBy: { order: "asc" } } },
  });
};

const getProgramById = async (id) => {
  const program = await prisma.workoutProgram.findUnique({
    where: { id },
    include: { exercises: { orderBy: { order: "asc" } } },
  });

  if (!program) {
    throw new AppError(404, "Workout program not found");
  }

  return program;
};


const deleteExercises = async (tx, programId, exercisesToDelete = []) => {
  if (!exercisesToDelete || exercisesToDelete.length === 0) return;

  await tx.workoutExercise.deleteMany({
    where: {
      id: { in: exercisesToDelete.map((e) => e.id) },
      programId,
    },
  });
};

const updateExercises = async (tx, programId, exercisesToUpdate = []) => {
  for (const update of exercisesToUpdate || []) {
    const existing = await tx.workoutExercise.findUnique({ where: { id: update.id } });
    if (!existing || existing.programId !== programId) {
      throw new AppError(404, "Workout exercise not found");
    }

    await tx.workoutExercise.update({
      where: { id: existing.id },
      data: {
        exerciseId: update.exerciseId ?? existing.exerciseId,
        sets: update.sets ?? existing.sets,
        reps: update.reps ?? existing.reps,
        weight: update.weight ?? existing.weight,
        rest: update.rest ?? existing.rest,
        order: update.order ?? existing.order,
        notes: update.notes ?? existing.notes,
      },
    });
  }
};

const addExercises = async (tx, programId, exercisesToAdd = []) => {
  for (const ex of exercisesToAdd || []) {
    await tx.workoutExercise.create({
      data: {
        programId,
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight ?? null,
        rest: ex.rest ?? null,
        order: ex.order,
        notes: ex.notes ?? null,
      },
    });
  }
};
const updateProgram = async (id, data) => {
  const parsed = WorkoutProgramUpdateRequestDto.parse(data);

  return prisma.$transaction(async (tx) => {
    const program = await tx.workoutProgram.findUnique({ where: { id } });
    if (!program) {
      throw new AppError(404, "Workout program not found");
    }

    if (parsed.name !== undefined) {
      await tx.workoutProgram.update({
        where: { id },
        data: { name: parsed.name },
      });
    }

    await deleteExercises(tx, id, parsed.exercisesToDelete);
    await updateExercises(tx, id, parsed.exercisesToUpdate);
    await addExercises(tx, id, parsed.exercisesToAdd);

    return tx.workoutProgram.findUnique({
      where: { id },
      include: { exercises: { orderBy: { order: "asc" } } },
    });
  });
};

const deleteProgram = async (id) => {
  const program = await prisma.workoutProgram.findUnique({ where: { id } });
  if (!program) {
    throw new AppError(404, "Workout program not found");
  }

  await prisma.workoutProgram.delete({ where: { id } });
};

module.exports = {
  createProgram,
  listPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
};