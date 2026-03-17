// src/dto/tools/getWorkoutPrograms.dto.js
import { z } from "zod";


export const GetWorkoutProgramsToolInputDto = z.object({
  includeExercises: z.boolean().optional().default(true),
});


export const WorkoutExerciseResponseDto = z.object({
  id: z.string(),
  programId: z.string(),
  exerciseId: z.string(),
  sets: z.number(),
  reps: z.string(),
  weight: z.number().nullable(),
  rest: z.number().nullable(),
  order: z.number(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  exercise: z.object({
    id: z.string(),
    name: z.string(),
    muscleGroup: z.string(),
  }),
});

export const WorkoutProgramResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  clientId: z.string(),
  coachId: z.string(),
  templateId: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  exercises: z.array(WorkoutExerciseResponseDto),
});

export const GetWorkoutProgramsToolOutputDto = z.object({
  data: z.array(WorkoutProgramResponseDto),
  summaries: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      exerciseCount: z.number().int().nonnegative(),
      muscleGroups: z.array(z.string()),
    })
  ).optional(),
});
