// src/dto/tools/updateWorkoutExercise.dto.js
import { z } from "zod";
import { WorkoutLogResponseDto } from "./reportWorkout.dto.js";

export const UpdateWorkoutExerciseToolInputDto = z.object({
  exerciseLogId: z.string().min(1), // path param
  id: z.string(), 
  exerciseName: z.string().min(1),
  weight: z.number().nullable().optional(),
});

export const UpdateWorkoutExerciseToolOutputDto = WorkoutLogResponseDto;
