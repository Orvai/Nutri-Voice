// src/dto/tools/reportWorkout.dto.js
import { z } from "zod";

export const EffortLevelEnum = z.enum([
  "EASY",
  "NORMAL",
  "HARD",
  "FAILED",
  "SKIPPED",
]);

export const WorkoutExerciseCreateDto = z.object({
  exerciseName: z.string().min(1),
  weight: z.number().nullable().optional(),
});

export const ReportWorkoutToolInputDto = z.object({
  date: z.string().datetime().optional(),
  workoutType: z.string().min(1),
  effortLevel: EffortLevelEnum,
  notes: z.string().optional(),
  exercises: z.array(WorkoutExerciseCreateDto).min(1),
});

export const WorkoutLogResponseDto = z.object({
  data: z.object({
    id: z.string(),
    clientId: z.string(),
    date: z.string().datetime(),
    workoutType: z.string(),
    effortLevel: EffortLevelEnum,
    notes: z.string().nullable(),
    loggedAt: z.string().datetime().optional(),
    exercises: z.array(
      z.object({
        id: z.string(),
        workoutLogId: z.string(),
        exerciseName: z.string(),
        weight: z.number().nullable(),
      })
    ),
  }),
});

export const ReportWorkoutToolOutputDto = WorkoutLogResponseDto;
