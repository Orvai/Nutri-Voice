import { z } from "zod";

/* =============================================================================
   TEMPLATE MENUS – GATEWAY DTO (ALIGNED 1:1 TO menu-service)
============================================================================= */

/* =========================
   Meal Option
========================= */
const TemplateMenuMealOptionDto = z.object({
  mealTemplateId: z.string(),
  name: z.string().nullable().optional(),
  orderIndex: z.number().int().nonnegative().optional(),
});

/* =========================
   Meal
========================= */
const TemplateMenuMealDto = z.object({
  name: z.string().min(1),
  notes: z.string().nullable().optional(),
  totalCalories: z.number().optional(),
  options: z.array(TemplateMenuMealOptionDto).optional(),
});

/* =========================
   Vitamin
========================= */
const TemplateMenuVitaminDto = z.object({
  vitaminId: z.string().nullable().optional(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
});

/* =========================
   Inline MealTemplate (for option create)
========================= */
const MealTemplateItemForOptionDto = z.object({
  foodItemId: z.string(),
  role: z.string(),
  grams: z.number().positive().optional(),
});

const MealTemplateForOptionDto = z.object({
  name: z.string().min(1),
  kind: z.string().optional(),
  items: z.array(MealTemplateItemForOptionDto).optional(),
});

/* =========================
   CREATE TemplateMenu
========================= */
export const TemplateMenuCreateRequestDto = z.object({
  name: z.string().min(1),
  dayType: z.string(),
  notes: z.string().nullable().optional(),
  meals: z.array(TemplateMenuMealDto).optional(),
  vitamins: z.array(TemplateMenuVitaminDto).optional(),
});

/* =========================
   UPDATE TemplateMenu
========================= */
export const TemplateMenuUpdateRequestDto = z.object({
  name: z.string().min(1).optional(),
  dayType: z.string().optional(),
  notes: z.string().nullable().optional(),

  mealsToAdd: z.array(TemplateMenuMealDto).optional(),
  mealsToUpdate: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        notes: z.string().nullable().optional(),
        totalCalories: z.number().optional(),
      })
    )
    .optional(),
  mealsToDelete: z.array(z.object({ id: z.string() })).optional(),

  mealOptionsToAdd: z
    .array(
      z.object({
        mealId: z.string(),
        mealTemplateId: z.string().optional(),
        name: z.string().nullable().optional(),
        orderIndex: z.number().int().nonnegative().optional(),
        template: MealTemplateForOptionDto.optional(),
      })
    )
    .optional(),

  mealOptionsToDelete: z.array(z.object({ id: z.string() })).optional(),

  vitaminsToAdd: z.array(TemplateMenuVitaminDto).optional(),
  vitaminsToDelete: z.array(z.object({ id: z.string() })).optional(),
});

/* =========================
   RESPONSE (REAL service response)
========================= */
export const TemplateMenuResponseDto = z.object({
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
      notes: z.string().nullable(),
      totalCalories: z.number(),

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
                grams: z.number(),

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
