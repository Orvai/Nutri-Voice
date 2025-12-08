const { z } = require("zod");

const WorkoutExerciseItemCreateDto = z.object({
  exerciseId: z.string(),
  sets: z.number().int().positive(),
  reps: z.string(),
  weight: z.number().optional(),
  rest: z.number().int().optional(),
  order: z.number().int().nonnegative(),
  notes: z.string().optional(),
});

const WorkoutExerciseItemUpdateDto = z.object({
  id: z.string(),
  exerciseId: z.string().optional(),
  sets: z.number().int().positive().optional(),
  reps: z.string().optional(),
  weight: z.number().optional(),
  rest: z.number().int().optional(),
  order: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
});

const WorkoutExerciseItemDeleteDto = z.object({
  id: z.string(),
});

const WorkoutProgramCreateRequestDto = z.object({
  name: z.string().min(2),
  clientId: z.string(),
  coachId: z.string(),
  exercises: z.array(WorkoutExerciseItemCreateDto).optional().default([]),
});

const WorkoutProgramUpdateRequestDto = z.object({
  name: z.string().optional(),
  exercisesToAdd: z.array(WorkoutExerciseItemCreateDto).optional(),
  exercisesToUpdate: z.array(WorkoutExerciseItemUpdateDto).optional(),
  exercisesToDelete: z.array(WorkoutExerciseItemDeleteDto).optional(),
});

const WorkoutExerciseResponseDto = z.object({
  id: z.string(),
  programId: z.string(),
  exerciseId: z.string(),
  sets: z.number(),
  reps: z.string(),
  weight: z.number().nullable(),
  rest: z.number().nullable(),
  order: z.number(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const WorkoutProgramResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  clientId: z.string(),
  coachId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  exercises: z.array(WorkoutExerciseResponseDto),
});

module.exports = {
  WorkoutExerciseItemCreateDto,
  WorkoutExerciseItemUpdateDto,
  WorkoutExerciseItemDeleteDto,
  WorkoutProgramCreateRequestDto,
  WorkoutProgramUpdateRequestDto,
  WorkoutExerciseResponseDto,
  WorkoutProgramResponseDto,
};