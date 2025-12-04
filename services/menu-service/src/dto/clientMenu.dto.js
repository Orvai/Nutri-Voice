const { z } = require("zod");

//
// CREATE empty client menu
//
const ClientMenuCreateRequestDto = z.object({
  clientId: z.string(),
  name: z.string(),
  type: z.string(), // enum
  notes: z.string().nullable().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

//
// CREATE from template
//
const ClientMenuCreateFromTemplateDto = z.object({
  templateMenuId: z.string(),
  clientId: z.string(),
  coachId: z.string(),
  name: z.string().optional(),

  selectedOptions: z
    .array(
      z.object({
        templateMealId: z.string(),
        optionId: z.string(),
      })
    )
    .optional(),
});

//
// UPDATE client menu
//
const ClientMenuUpdateRequestDto = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  notes: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  mealsToAdd: z.array(z.object({
    templateId: z.string(),
    name: z.string().optional(),
  })).optional(),

  mealsToUpdate: z.array(z.object({
    id: z.string(),
    name: z.string().optional(),
    itemsToAdd: z.array(z.object({
      foodItemId: z.string(),
      quantity: z.number(),
      notes: z.string().nullable().optional(),
    })).optional(),
    itemsToUpdate: z.array(z.object({
      id: z.string(),
      foodItemId: z.string().optional(),
      quantity: z.number().optional(),
      notes: z.string().nullable().optional(),
    })).optional(),
    itemsToDelete: z.array(z.object({
      id: z.string(),
    })).optional(),
  })).optional(),

  mealsToDelete: z.array(z.object({
    id: z.string(),
  })).optional(),

  vitaminsToAdd: z.array(z.object({
    vitaminId: z.string().nullable().optional(),
    name: z.string(),
    description: z.string().nullable().optional(),
  })).optional(),

  vitaminsToUpdate: z.array(z.object({
    id: z.string(),
    vitaminId: z.string().nullable().optional(),
    name: z.string().optional(),
    description: z.string().nullable().optional(),
  })).optional(),

  vitaminsToDelete: z.array(z.object({
    id: z.string(),
  })).optional(),
});

//
// RESPONSE DTO (FULL)
//
const ClientMenuResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  notes: z.string().nullable(),
  isActive: z.boolean(),

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

      items: z.array(
        z.object({
          id: z.string(),
          quantity: z.number(),
          calories: z.number(),
          notes: z.string().nullable(),
          foodItem: z.object({
            id: z.string(),
            name: z.string(),
            caloriesPer100g: z.number().nullable(),
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
  ClientMenuCreateRequestDto,
  ClientMenuUpdateRequestDto,
  ClientMenuCreateFromTemplateDto,
  ClientMenuResponseDto,
};
