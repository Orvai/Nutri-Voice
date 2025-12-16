import { z } from "zod";

/* =============================================================================
   MEAL TEMPLATES – GATEWAY DTO (ALIGNED)
============================================================================= */

/**
 * ============================
 * Item DTOs
 * ============================
 */

const MealTemplateItemCreateDto = z.object({
  foodItemId: z.string(),
  role: z.string(), // enum validated in menu-service
  grams: z.number().positive().optional(),
});

const MealTemplateItemUpdateDto = z.object({
  id: z.string(),
  foodItemId: z.string().optional(),
  role: z.string().optional(),
  grams: z.number().positive().optional(),
});

/**
 * ============================
 * Create
 * ============================
 */
export const MealTemplateCreateRequestDto = z.object({
  name: z.string().min(1),
  kind: z.string(), // enum validated in menu-service
  items: z.array(MealTemplateItemCreateDto).optional(),
});

/**
 * ============================
 * Update
 * ============================
 */
export const MealTemplateUpdateRequestDto = z.object({
  name: z.string().min(1).optional(),
  kind: z.string().optional(),

  itemsToAdd: z.array(MealTemplateItemCreateDto).optional(),
  itemsToUpdate: z.array(MealTemplateItemUpdateDto).optional(),
  itemsToDelete: z.array(z.object({ id: z.string() })).optional(),
});

/**
 * ============================
 * Response (REAL menu-service response)
 * ============================
 */
export const MealTemplateResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.string(),

  items: z.array(
    z.object({
      id: z.string(),
      foodItemId: z.string(),
      role: z.string(),
      grams: z.number(),

      foodItem: z.object({
        id: z.string(),
        name: z.string(),
        caloriesPer100g: z.number().nullable(),
      }),
    })
  ),
});
