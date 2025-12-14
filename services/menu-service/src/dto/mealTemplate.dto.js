const { z } = require("zod");
const { MealItemCreateDto, MealItemUpdateDto, MealItemDeleteDto } = require("./items.dto");

const MealTemplateCreateDto = z
  .object({
    name: z.string().min(1),
    kind: z.string(),
    totalCalories: z.number().optional(),
    items: z.array(MealItemCreateDto).optional(),
  })
  .strict();

const MealTemplateUpsertDto = z
  .object({
    name: z.string().optional(),
    kind: z.string().optional(),
    totalCalories: z.number().optional(),
    itemsToAdd: z.array(MealItemCreateDto).optional(),
    itemsToUpdate: z.array(MealItemUpdateDto).optional(),
    itemsToDelete: z.array(MealItemDeleteDto).optional(),
  })
  .strict();

const MealTemplateResponseDto = z
  .object({
    id: z.string(),
    name: z.string(),
    kind: z.string(),
    totalCalories: z.number(),
    items: z.array(
      z
        .object({
          id: z.string(),
          role: z.string(),
          defaultGrams: z.number(),
          defaultCalories: z.number().nullable(),
          notes: z.string().nullable(),
          foodItem: z
            .object({
              id: z.string(),
              name: z.string(),
              caloriesPer100g: z.number().nullable(),
            })
            .strict(),
        })
        .strict()
    ),
  })
  .strict();

module.exports = {
  MealTemplateCreateDto,
  MealTemplateUpsertDto,
  MealTemplateResponseDto,
};