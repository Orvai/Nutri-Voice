const { z } = require("zod");

//
// CREATE
//
const MealTemplateCreateDto = z.object({
  coachId: z.string(),
  name: z.string().min(1),
  kind: z.string(), // enum validated by Prisma
  totalCalories: z.number().optional(),

  items: z
    .array(
      z.object({
        foodItemId: z.string(),
        role: z.string(), // enum
        defaultGrams: z.number().optional(),
        defaultCalories: z.number().nullable().optional(),
        notes: z.string().nullable().optional(),
      })
    )
    .optional(),
});

//
// UPDATE
//
const MealTemplateUpsertDto = z.object({
  name: z.string().optional(),
  kind: z.string().optional(),
  totalCalories: z.number().optional(),

  itemsToAdd: z
    .array(
      z.object({
        foodItemId: z.string(),
        role: z.string(),
        defaultGrams: z.number().optional(),
        defaultCalories: z.number().nullable().optional(),
        notes: z.string().nullable().optional(),
      })
    )
    .optional(),

  itemsToUpdate: z
    .array(
      z.object({
        id: z.string(),
        foodItemId: z.string().optional(),
        role: z.string().optional(),
        defaultGrams: z.number().optional(),
        defaultCalories: z.number().nullable().optional(),
        notes: z.string().nullable().optional(),
      })
    )
    .optional(),

  itemsToDelete: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
});

//
// RESPONSE
//
const MealTemplateResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.string(),
  totalCalories: z.number(),
  items: z.array(
    z.object({
      id: z.string(),
      role: z.string(),
      defaultGrams: z.number(),
      defaultCalories: z.number().nullable(),
      notes: z.string().nullable(),
      foodItem: z.object({
        id: z.string(),
        name: z.string(),
        caloriesPer100g: z.number().nullable(),
      }),
    })
  ),
});

module.exports = {
  MealTemplateCreateDto,
  MealTemplateUpsertDto,
  MealTemplateResponseDto,
};
