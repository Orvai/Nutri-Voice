const { prisma } = require("../db/prisma");
const { AppError } = require("../common/errors");
const {
  WorkoutProgramCreateRequestDto,
  WorkoutProgramUpdateRequestDto,
} = require("../dto/workoutProgram.dto");

/* ==============================================================
   INCLUDE FULL RELATIONS — USED EVERYWHERE
============================================================== */
const programIncludes = {
  template: true, // מחזיר את הטמפלייט במידה ויש
  exercises: {
    orderBy: { order: "asc" },
    include: {
      exercise: true,   // ❗ זה החלק הקריטי שחסר אצלך
    },
  },
};

/* ==============================================================
   CREATE PROGRAM
============================================================== */
const createProgram = async (data) => {
  const parsed = WorkoutProgramCreateRequestDto.parse(data);

  return prisma.$transaction(async (tx) => {
    const program = await tx.workoutProgram.create({
      data: {
        name: parsed.name,
        clientId: parsed.clientId,
        coachId: parsed.coachId,
        templateId: parsed.templateId ?? null,
      },
    });

    /* ----- Build from Template ----- */
    if (parsed.templateId) {
      const template = await tx.workoutTemplate.findUnique({
        where: { id: parsed.templateId },
      });

      if (!template) throw new AppError(404, "Template not found");

      const autoExercises = await prisma.exercise.findMany({
        where: {
          muscleGroup: { in: template.muscleGroups },
        },
      });

      let order = 0;

      await tx.workoutExercise.createMany({
        data: autoExercises.map((ex) => ({
          programId: program.id,
          exerciseId: ex.id,
          sets: 4,
          reps: "10-12",
          weight: null,
          rest: null,
          order: order++,
          notes: null,
        })),
      });
    }

    /* ----- User Provided Exercises ----- */
    if (!parsed.templateId && parsed.exercises?.length > 0) {
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
      include: programIncludes,
    });
  });
};

/* ==============================================================
   LIST PROGRAMS
============================================================== */
const listPrograms = async (filters = {}) => {
  const where = {};

  if (filters.clientId) where.clientId = filters.clientId;
  if (filters.coachId) where.coachId = filters.coachId;

  return prisma.workoutProgram.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: programIncludes,
  });
};

/* ==============================================================
   GET PROGRAM BY ID
============================================================== */
const getProgramById = async (id) => {
  const program = await prisma.workoutProgram.findUnique({
    where: { id },
    include: programIncludes,
  });

  if (!program) throw new AppError(404, "Workout program not found");

  return program;
};

/* ==============================================================
   DELETE EXERCISES
============================================================== */
const deleteExercises = async (tx, programId, exercisesToDelete = []) => {
  if (!exercisesToDelete?.length) return;

  await tx.workoutExercise.deleteMany({
    where: {
      id: { in: exercisesToDelete.map((e) => e.id) },
      programId,
    },
  });
};

/* ==============================================================
   UPDATE EXERCISES
============================================================== */
const updateExercises = async (tx, programId, exercisesToUpdate = []) => {
  for (const update of exercisesToUpdate || []) {
    const existing = await tx.workoutExercise.findUnique({
      where: { id: update.id },
    });

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

/* ==============================================================
   ADD EXERCISES
============================================================== */
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

/* ==============================================================
   UPDATE PROGRAM
============================================================== */
const updateProgram = async (id, data) => {
  const parsed = WorkoutProgramUpdateRequestDto.parse(data);

  return prisma.$transaction(async (tx) => {
    const program = await tx.workoutProgram.findUnique({ where: { id } });
    if (!program) throw new AppError(404, "Workout program not found");

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
      include: programIncludes,
    });
  });
};

/* ==============================================================
   DELETE PROGRAM
============================================================== */
const deleteProgram = async (id) => {
  const program = await prisma.workoutProgram.findUnique({ where: { id } });
  if (!program) throw new AppError(404, "Workout program not found");

  await prisma.workoutProgram.delete({ where: { id } });
};

module.exports = {
  createProgram,
  listPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
};
