const { z } = require("zod");

//
// CREATE TemplateMenu
//
const TemplateMenuCreateDto = z.object({
  coachId: z.string(),
  name: z.string().min(1),
  dayType: z.string(), // enum
  notes: z.string().nullable().optional(),

  meals: z
    .array(
      z.object({
        name: z.string(),
        options: z
          .array(
            z.object({
              mealTemplateId: z.string(),
              name: z.string().nullable().optional(),
              orderIndex: z.number().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),

  vitamins: z
    .array(
      z.object({
        vitaminId: z.string().nullable().optional(),
        name: z.string(),
        description: z.string().nullable().optional(),
      })
    )
    .optional(),
});

//
// UPDATE TemplateMenu
//
const TemplateMenuUpdateDto = z.object({
  name: z.string().optional(),
  dayType: z.string().optional(),
  notes: z.string().nullable().optional(),
  totalCalories: z.number().optional(),
});

//
// RESPONSE TemplateMenu (FULL)
//
const TemplateMenuResponseDto = z.object({
  id: z.string(),
  coachId: z.string(),
  name: z.string(),
  dayType: z.string(),
  notes: z.string().nullable(),
  totalCalories: z.number(),

  meals: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      selectedOptionId: z.string().nullable(),
      options: z.array(
        z.object({
          id: z.string(),
          name: z.string().nullable(),
          orderIndex: z.number(),
          mealTemplate: z.object({
            id: z.string(),
            name: z.string(),
            kind: z.string(),
            items: z.array(
              z.object({
                id: z.string(),
                role: z.string(),
                defaultGrams: z.number(),
                notes: z.string().nullable(),
                foodItem: z.object({
                  id: z.string(),
                  name: z.string(),
                  caloriesPer100g: z.number().nullable(),
                }),
              })
            ),
          }),
        })
      ),
    })
  ),

  vitamins: z.array(
    z.object({
      id: z.string(),
      vitaminId: z.string().nullable(),
      name: z.string(),
      description: z.string().nullable(),
    })
  ),
});

module.exports = {
  TemplateMenuCreateDto,
  TemplateMenuUpdateDto,
  TemplateMenuResponseDto,
};
