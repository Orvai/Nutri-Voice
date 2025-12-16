import { z } from "zod";

/* =============================================================================
   FOOD ITEMS – GATEWAY DTO (ALIGNED TO menu-service)
============================================================================= */

/**
 * CREATE
 * ⚠️ category ו-caloriesPer100g הם חובה בדומיין
 */
export const FoodItemRequestCreateDto = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  category: z.string().min(1),
  caloriesPer100g: z.number().nonnegative(),
});

/**
 * UPDATE
 */
export const FoodItemRequestUpdateDto = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  category: z.string().min(1).optional(),
  caloriesPer100g: z.number().nonnegative().optional(),
});

/**
 * RESPONSE (REAL microservice response)
 */
export const FoodItemResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  caloriesPer100g: z.number(),
});
