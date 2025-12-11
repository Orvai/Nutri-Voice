const { z } = require("zod");

/* =============================================================================
   FOOD ITEMS
============================================================================= */

const FoodItemRequestCreateDto = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  caloriesPer100g: z.number().nullable().optional(),
  proteinPer100g: z.number().nullable().optional(),
});
const FoodItemRequestUpdateDto = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  caloriesPer100g: z.number().nullable().optional(),
  proteinPer100g: z.number().nullable().optional(),
});

// Real response from microservice
const FoodItemResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  caloriesPer100g: z.number().nullable(),
  proteinPer100g: z.number().nullable(),
});

/* =============================================================================
   MEAL TEMPLATES
============================================================================= */

const MealTemplateCreateRequestDto = z.object({
  name: z.string(),
  kind: z.string(), // enum (backend validated)
  totalCalories: z.number().optional(),
  items: z
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
});

const MealTemplateUpdateRequestDto = z.object({
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

  itemsToDelete: z.array(z.object({ id: z.string() })).optional(),
});

// REAL RESPONSE from menu-service
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

/* =============================================================================
   TEMPLATE MENUS (Daily plan templates)
============================================================================= */

const TemplateMenuCreateRequestDto = z.object({
  name: z.string(),
  dayType: z.string(),
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

const TemplateMenuUpdateRequestDto = z.object({
  name: z.string().optional(),
  dayType: z.string().optional(),
  notes: z.string().nullable().optional(),
  totalCalories: z.number().optional(),

  mealsToAdd: z.array(
    z.object({
      name: z.string(),
      totalCalories: z.number().nullable().optional(),
      orderIndex: z.number().optional(),
    })
  ).optional(),

  mealsToUpdate: z.array(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      selectedOptionId: z.string().nullable().optional(),
      totalCalories: z.number().nullable().optional(),
    })
  ).optional(),

  mealsToDelete: z.array(z.object({ id: z.string() })).optional(),

  mealOptionsToAdd: z.array(
    z.object({
      mealId: z.string(),
      mealTemplateId: z.string().optional(),
      name: z.string().nullable().optional(),
      orderIndex: z.number().optional(),
    })
  ).optional(),

  mealOptionsToDelete: z.array(z.object({ id: z.string() })).optional(),

  vitaminsToAdd: z.array(
    z.object({
      vitaminId: z.string().nullable().optional(),
      name: z.string(),
      description: z.string().nullable().optional(),
    })
  ).optional(),

  vitaminsToDelete: z.array(z.object({ id: z.string() })).optional(),
});

// REAL and FULL structure
const TemplateMenuResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  coachId: z.string(),
  dayType: z.string(),
  notes: z.string().nullable(),
  totalCalories: z.number(),

  meals: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      totalCalories: z.number().nullable().optional(),
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
            totalCalories: z.number().nullable().optional(),
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

/* =============================================================================
   CLIENT MENUS
============================================================================= */

const ClientMenuCreateRequestDto = z.object({
  clientId: z.string(),
  name: z.string(),
  type: z.string(),
  notes: z.string().nullable().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const ClientMenuCreateFromTemplateRequestDto = z.object({
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

const ClientMenuUpdateRequestDto = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  notes: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  mealsToAdd: z.array(
    z.object({
      templateId: z.string(),
      name: z.string().optional(),
    })
  ).optional(),

  mealsToUpdate: z.any().optional(),
  mealsToDelete: z.array(z.object({ id: z.string() })).optional(),

  mealOptionsToAdd: z.any().optional(),
  mealOptionsToDelete: z.any().optional(),

  itemsToAdd: z.any().optional(),
  itemsToUpdate: z.any().optional(),
  itemsToDelete: z.any().optional(),

  vitaminsToAdd: z.any().optional(),
  vitaminsToUpdate: z.any().optional(),
  vitaminsToDelete: z.any().optional(),
});

// REAL FULL RESPONSE
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

/* =============================================================================
   VITAMINS
============================================================================= */

const VitaminCreateRequestDto = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
});

const VitaminUpdateRequestDto = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
});

const VitaminResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

/* =============================================================================
   EXPORT
============================================================================= */

module.exports = {
  // Food
  FoodItemRequestCreateDto,
  FoodItemRequestUpdateDto,
  FoodItemResponseDto,

  // Meal Templates
  MealTemplateCreateRequestDto,
  MealTemplateUpdateRequestDto,
  MealTemplateResponseDto,

  // Template Menus
  TemplateMenuCreateRequestDto,
  TemplateMenuUpdateRequestDto,
  TemplateMenuResponseDto,

  // Client Menus
  ClientMenuCreateRequestDto,
  ClientMenuUpdateRequestDto,
  ClientMenuCreateFromTemplateRequestDto,
  ClientMenuResponseDto,

  // Vitamins
  VitaminCreateRequestDto,
  VitaminUpdateRequestDto,
  VitaminResponseDto,
};
