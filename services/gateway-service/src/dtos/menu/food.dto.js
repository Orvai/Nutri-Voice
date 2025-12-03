// src/dto/menu/food.dto.js
import { z } from "zod";

/* ========= FOOD CREATE ========= */

export const FoodCreateDto = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.string().min(2),
  caloriesPer100g: z.number().optional(),
  proteinPer100g: z.number().optional(),
});

/* ========= FOOD UPDATE ========= */

export const FoodUpdateDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  caloriesPer100g: z.number().optional(),
  proteinPer100g: z.number().optional(),
});

/* ========= FOOD QUERY ========= */

export const FoodListQueryDto = z.object({
  category: z.string().optional(),
});

export const FoodSearchQueryDto = z.object({
  name: z.string().min(1),
});
