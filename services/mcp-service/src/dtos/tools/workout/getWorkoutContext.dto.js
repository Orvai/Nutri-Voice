// src/dto/tools/getWorkoutContext.dto.js
import { z } from "zod";
import { WorkoutProgramResponseDto } from "./getWorkoutPrograms.dto.js";

/**
 * Tool Input: get_workout_context
 */
export const GetWorkoutContextToolInputDto = z.object({
  clientId: z.string().min(1),
  programId: z.string().min(1).optional(),
});

export const GetWorkoutContextToolOutputDto = z.object({
  data: WorkoutProgramResponseDto, 
});
