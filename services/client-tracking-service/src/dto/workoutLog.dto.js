const { z } = require('zod');

/**
 * Effort level enum
 */
const EffortLevelEnum = z.enum([
  'EASY',
  'NORMAL',
  'HARD',
  'FAILED',
  'SKIPPED'
]);

/**
 * Exercise entry for CREATE
 */
const WorkoutExerciseCreateDto = z.object({
  exerciseName: z.string().min(1),
  weight: z.number().nullable().optional()
});

/**
 * Workout Log - CREATE
 */
const WorkoutLogCreateDto = z.object({
  date: z.string().datetime().optional(),
  workoutType: z.string().min(1),
  effortLevel: EffortLevelEnum,
  notes: z.string().optional(),
  exercises: z.array(WorkoutExerciseCreateDto)
});

/**
 * Exercise entry for UPDATE
 */
const WorkoutExerciseUpdateDto = z.object({
  id: z.string().min(1), // מזהה הלוג של התרגיל
  exerciseName: z.string().min(1),
  weight: z.number().nullable().optional()
});

/**
 * Workout Log - UPDATE
 */
const WorkoutLogUpdateDto = z.object({
  workoutType: z.string().optional(),
  effortLevel: EffortLevelEnum.optional(),
  notes: z.string().optional(),
  exercises: z.array(WorkoutExerciseUpdateDto).optional()
});

module.exports = {
  EffortLevelEnum,
  WorkoutLogCreateDto,
  WorkoutLogUpdateDto,
  WorkoutExerciseCreateDto,
  WorkoutExerciseUpdateDto
};
