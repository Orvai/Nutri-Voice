// src/dto/food.dto.js
const { z } = require("zod");

const FoodItemCreateRequestDto = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  caloriesPer100g: z.number().optional(),
  proteinPer100g: z.number().optional(),
});

const FoodItemUpdateRequestDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  caloriesPer100g: z.number().optional(),
  proteinPer100g: z.number().optional(),
});

const FoodItemResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  caloriesPer100g: z.number().nullable(),
  proteinPer100g: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

module.exports = {
  FoodItemCreateRequestDto,
  FoodItemUpdateRequestDto,
  FoodItemResponseDto,
};
