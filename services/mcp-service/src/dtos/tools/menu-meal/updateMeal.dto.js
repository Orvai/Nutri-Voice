// src/dtos/tools/menu-meal/updateMeal.dto.js
import { z } from "zod";

/**
 * Shared enums
 * (אם כבר קיים אצלך Enum כזה במקום אחר – תייבא משם)
 */
export const DayTypeEnum = z.enum(["TRAINING", "REST"]);

/* ============================================
   UPDATE MEAL (Tool DTO)
============================================ */

/**
 * Input DTO for updating a meal log
 * All fields optional – partial update
 */
export const UpdateMealInputDto = z.object({
  logId: z.string().min(1),
  calories: z.number().int().optional(),
  protein: z.number().int().optional(),
  carbs: z.number().int().optional(),
  fat: z.number().int().optional(),

  description: z.string().optional(),
  matchedMenuItemId: z.string().nullable().optional(),

  dayType: DayTypeEnum.optional(),
}).strict();

/**
 * Response DTO returned after update
 * Mirrors MealLogResponseDto structure
 */
export const UpdateMealResponseDto = z.object({
  data: z.object({
    id: z.string(),
    clientId: z.string(),

    date: z.string().datetime(),
    dayType: DayTypeEnum,

    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),

    description: z.string().nullable(),
    matchedMenuItemId: z.string().nullable(),

    loggedAt: z.string().datetime().optional(),
  }),
  diff: z.object({
    changedFields: z.array(z.string()),
    oldCalories: z.number().nullable().optional(),
    newCalories: z.number().nullable().optional(),
    oldPortion: z.string().nullable().optional(),
    newPortion: z.string().nullable().optional(),
    oldFood: z.string().nullable().optional(),
    newFood: z.string().nullable().optional(),
  }),
});
