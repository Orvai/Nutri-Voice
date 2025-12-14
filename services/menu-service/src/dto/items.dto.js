const { z } = require("zod");

const MealItemCreateDto = z
  .object({
    foodItemId: z.string(),
    quantity: z.number().optional(),
    defaultGrams: z.number().optional(),
    defaultCalories: z.number().nullable().optional(),
    role: z.string().optional(),
    notes: z.string().nullable().optional(),
  })
  .strict();

const MealItemUpdateDto = z
  .object({
    id: z.string(),
    foodItemId: z.string().optional(),
    quantity: z.number().optional(),
    defaultGrams: z.number().optional(),
    defaultCalories: z.number().nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .strict();

const MealItemDeleteDto = z.object({ id: z.string() }).strict();

module.exports = {
  MealItemCreateDto,
  MealItemUpdateDto,
  MealItemDeleteDto,
};