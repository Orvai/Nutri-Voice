const { prisma } = require('../db/prisma');
const {
  WorkoutLogCreateDto,
  WorkoutLogUpdateDto
} = require('../dto/workoutLog.dto');

const startOfDay = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (d) => {
  const date = new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
};

/**
 * Create a workout log + exercises
 */
const createWorkoutLog = async (payload) => {
  const data = WorkoutLogCreateDto.parse(payload);

  const logDate = data.date ? new Date(data.date) : new Date();

  const workoutLog = await prisma.workoutLog.create({
    data: {
      clientId: payload.clientId,
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

  return workoutLog;
};

/**
 * Get full workout history (no date limit)
 */
const listAllWorkouts = (clientId) => {
  return prisma.workoutLog.findMany({
    where: { clientId },
    orderBy: [{ date: 'asc' }, { loggedAt: 'asc' }],
    include: {
      exercises: true
    }
  });
};

/**
 * Update full workout log + exercises
 */
const updateWorkoutLog = async (logId, payload) => {
  const data = WorkoutLogUpdateDto.parse(payload);

  const updatedWorkout = await prisma.workoutLog.update({
    where: { id: logId },
    data: {
      workoutType: data.workoutType,
      effortLevel: data.effortLevel,
      notes: data.notes
    }
  });

  if (data.exercises && data.exercises.length > 0) {
    for (const ex of data.exercises) {
      await prisma.workoutExerciseLog.update({
        where: { id: ex.id },
        data: {
          exerciseName: ex.exerciseName,
          weight: ex.weight
        }
      });
    }
  }

  return updatedWorkout;
};

/**
 * Update only weight of a single exercise
 */
const updateExerciseWeight = async (exerciseLogId, weight) => {
  return prisma.workoutExerciseLog.update({
    where: { id: exerciseLogId },
    data: { weight }
  });
};

module.exports = {
  createWorkoutLog,
  listAllWorkouts,
  updateWorkoutLog,
  updateExerciseWeight
};
