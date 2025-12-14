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
}).strict();

/**
 * Workout Log - CREATE
 */
const WorkoutLogCreateDto = z.object({
  date: z.string().datetime().optional(),
  workoutType: z.string().min(1),
  effortLevel: EffortLevelEnum,
  notes: z.string().optional(),
  exercises: z.array(WorkoutExerciseCreateDto)
}).strict();

/**
 * Exercise entry for UPDATE
 */
const WorkoutExerciseUpdateDto = z.object({
  id: z.string().min(1), // מזהה הלוג של התרגיל
  exerciseName: z.string().min(1),
  weight: z.number().nullable().optional()
}).strict();

/**
 * Workout Log - UPDATE
 */
const WorkoutLogUpdateDto = z.object({
  workoutType: z.string().optional(),
  effortLevel: EffortLevelEnum.optional(),
  notes: z.string().optional(),
  exercises: z.array(WorkoutExerciseUpdateDto).optional()
}).strict();

const WorkoutExerciseResponseDto = z.object({
  id: z.string(),
  workoutLogId: z.string(),
  exerciseName: z.string(),
  weight: z.number().nullable()
}).strict();

const WorkoutLogResponseDto = z.object({
  id: z.string(),
  clientId: z.string(),
  date: z.string().datetime(),
  workoutType: z.string(),
  effortLevel: EffortLevelEnum,
  notes: z.string().nullable(),
  loggedAt: z.string().datetime().optional(),
  exercises: z.array(WorkoutExerciseResponseDto).default([])
}).strict();
const WorkoutHistoryResponseDto = z.array(WorkoutLogResponseDto);

const WorkoutExerciseWeightDto = z.object({
  weight: z.number().nullable()
}).strict();




module.exports = {
  EffortLevelEnum,
  WorkoutLogCreateDto,
  WorkoutLogUpdateDto,
  WorkoutExerciseCreateDto,
  WorkoutExerciseUpdateDto,
  WorkoutExerciseWeightDto,
  WorkoutLogResponseDto,
  WorkoutExerciseResponseDto,
  WorkoutHistoryResponseDto
};