const { z } = require("zod");

const FoodItemCreateDto = z
  .object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    category: z.string().min(1),
    caloriesPer100g: z.number(),
  })
  .strict();

const FoodItemUpdateDto = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    category: z.string().min(1).optional(),
    caloriesPer100g: z.number().optional(),
  })
  .strict();

const FoodListQueryDto = z
  .object({
    search: z.string().optional(),
  })
  .strict();

module.exports = {
  FoodItemCreateDto,
  FoodItemUpdateDto,
  FoodListQueryDto,
};
