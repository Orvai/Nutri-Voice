// src/dto/tools/updateWorkout.dto.js
import { z } from "zod";
import { EffortLevelEnum, WorkoutLogResponseDto } from "./reportWorkout.dto.js";

export const WorkoutExerciseUpdateDto = z.object({
  id: z.string(),
  exerciseName: z.string().min(1),
  weight: z.number().nullable().optional(),
});

export const UpdateWorkoutToolInputDto = z.object({
  logId: z.string().min(1), // path param
  workoutType: z.string().optional(),
  effortLevel: EffortLevelEnum.optional(),
  notes: z.string().optional(),
  exercises: z.array(WorkoutExerciseUpdateDto).optional(),
});

export const UpdateWorkoutToolOutputDto = WorkoutLogResponseDto;
