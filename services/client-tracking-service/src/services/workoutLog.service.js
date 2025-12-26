const { prisma } = require('../db/prisma');
const {
  WorkoutLogCreateDto,
  WorkoutLogUpdateDto
} = require('../dto/workoutLog.dto');
/**
 * Create a workout log + exercises
 */
const createWorkoutLog = async (clientId, payload) => {
  const data = WorkoutLogCreateDto.parse(payload);

  const logDate = data.date ? new Date(data.date) : new Date();

  const workoutLog = await prisma.workoutLog.create({
    data: {
      clientId,
      date: logDate,
      workoutType: data.workoutType,
      effortLevel: data.effortLevel,
      notes: data.notes
    }
  });

  if (data.exercises && data.exercises.length > 0) {
    await prisma.workoutExerciseLog.createMany({
      data: data.exercises.map((e) => ({
        workoutLogId: workoutLog.id,
        exerciseName: e.exerciseName,
        weight: e.weight ?? null
      }))
    });
  }

  return prisma.workoutLog.findUnique({
    where: { id: workoutLog.id },
    select: {
      id: true,
      clientId: true,
      date: true,
      workoutType: true,
      effortLevel: true,
      notes: true,
      loggedAt: true,
      exercises: {
        select: {
          id: true,
          workoutLogId: true,
          exerciseName: true,
          weight: true
        }
      }
    }
  });
};

/**
 * Get full workout history (no date limit)
 */
const listAllWorkouts = (clientId) => {
  return prisma.workoutLog.findMany({
    where: { clientId },
    orderBy: [{ date: 'asc' }, { loggedAt: 'asc' }],
    select: {
      id: true,
      clientId: true,
      date: true,
      workoutType: true,
      effortLevel: true,
      notes: true,
      loggedAt: true,
      exercises: {
        select: {
          id: true,
          workoutLogId: true,
          exerciseName: true,
          weight: true
        }
      }
    }
  });
};

/**
 * Update full workout log + exercises
 */
const updateWorkoutLog = async (logId, payload) => {
  const data = WorkoutLogUpdateDto.parse(payload);

  const updateData = {};
  if (data.workoutType !== undefined) updateData.workoutType = data.workoutType;
  if (data.effortLevel !== undefined) updateData.effortLevel = data.effortLevel;
  if (data.notes !== undefined) updateData.notes = data.notes;

  await prisma.workoutLog.update({
    where: { id: logId },
    data: updateData
  });

  if (data.exercises && data.exercises.length > 0) {
    for (const ex of data.exercises) {
      await prisma.workoutExerciseLog.update({
        where: { id: ex.id },
        data: {
          exerciseName: ex.exerciseName,
          weight: ex.weight ?? null
        }
      });
    }
  }

  return prisma.workoutLog.findUnique({
    where: { id: logId },
    select: {
      id: true,
      clientId: true,
      date: true,
      workoutType: true,
      effortLevel: true,
      notes: true,
      loggedAt: true,
      exercises: {
        select: {
          id: true,
          workoutLogId: true,
          exerciseName: true,
          weight: true
        }
      }
    }
  });
};

/**
 * Update only weight of a single exercise
 */
const updateExerciseWeight = async (exerciseLogId, weight) => {
  return prisma.workoutExerciseLog.update({
    where: { id: exerciseLogId },
    data: { weight: weight ?? null },
    select: {
      id: true,
      workoutLogId: true,
      exerciseName: true,
      weight: true
    }
  });
};

module.exports = {
  createWorkoutLog,
  listAllWorkouts,
  updateWorkoutLog,
  updateExerciseWeight
};