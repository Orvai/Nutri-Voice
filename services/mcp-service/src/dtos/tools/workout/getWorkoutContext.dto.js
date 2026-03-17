// src/dto/tools/getWorkoutContext.dto.js
import { z } from "zod";
import { WorkoutProgramResponseDto } from "./getWorkoutPrograms.dto.js";

/**
 * Tool Input: get_workout_context
 */
export const GetWorkoutContextToolInputDto = z.object({
  programId: z.string().min(1).optional(),
});

export const GetWorkoutContextToolOutputDto = z.object({
  currentProgram: WorkoutProgramResponseDto.nullable(),
  workoutDay: z.string().nullable(),
  exerciseList: z.array(
    z.object({
      id: z.string(),
      exerciseId: z.string(),
      exerciseName: z.string(),
      sets: z.number(),
      reps: z.string(),
      weight: z.number().nullable(),
      notes: z.string().nullable().optional(),
    })
  ),
  completionStatus: z.enum(["UNKNOWN", "NOT_REPORTED", "PARTIAL", "DONE"]),
  notes: z.array(z.string()),
  substitutions: z.array(z.object({
    fromExercise: z.string(),
    toExercise: z.string(),
    reason: z.string().optional(),
  })),
  progressionContext: z.object({
    hasHistory: z.boolean(),
    hint: z.string().nullable(),
  }),
});
