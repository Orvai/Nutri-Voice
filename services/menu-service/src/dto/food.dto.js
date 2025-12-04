const { z } = require("zod");

//
// CREATE
//
const FoodItemCreateRequestDto = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  caloriesPer100g: z.number().nullable().optional(),
  proteinPer100g: z.number().nullable().optional(),
});

//
// UPDATE
//
const FoodItemUpdateRequestDto = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  caloriesPer100g: z.number().nullable().optional(),
  proteinPer100g: z.number().nullable().optional(),
});

//
// RESPONSE
//
const FoodItemResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  caloriesPer100g: z.number().nullable(),
  proteinPer100g: z.number().nullable(),
});

module.exports = {
  FoodItemCreateRequestDto,
  FoodItemUpdateRequestDto,
  FoodItemResponseDto,
};
