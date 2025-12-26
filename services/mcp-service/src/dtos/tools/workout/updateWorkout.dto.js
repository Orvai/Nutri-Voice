// src/dto/tools/updateWorkout.dto.js
import { z } from "zod";
import { EffortLevelEnum, WorkoutLogResponseDto } from "./reportWorkout.dto.js";

/* ============================================================
   חלק 1: עדכון אימון שלם (קוד קיים + תיקון קטן)
   מתאים ל-tool: update_workout
============================================================ */

// זה אובייקט עזר למערך בתוך האימון השלם
export const WorkoutExerciseUpdateDto = z.object({
  id: z.string(), // מזהה התרגיל הקיים
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


export const UpdateWorkoutExerciseToolInputDto = z.object({
  exerciseLogId: z.string().min(1).describe("The ID of the specific exercise row"),
  weight: z.number().nullable().optional().describe("New weight in KG"),
  exerciseName: z.string().optional().describe("Update name if needed"),
});

export const UpdateWorkoutExerciseToolOutputDto = z.object({
  success: z.boolean(),
  id: z.string(),
  message: z.string(),
});