import { z } from "zod";

/* =============================================================================
   CLIENT MENUS – GATEWAY DTO
   (ALIGNED TO clientMenu microservice)
============================================================================= */

const IsoDate = z.string();

/* =========================
   CREATE ClientMenu
========================= */
export const ClientMenuCreateRequestDto = z.object({
  name: z.string().min(1),
  type: z.string(), // DayType enum validated in service
  notes: z.string().nullable().optional(),
  startDate: IsoDate.optional(),
  endDate: IsoDate.optional(),
});

/* =========================
   MEAL OPTIONS (ADD)
========================= */
const ClientMenuMealOptionAddDto = z.object({
  mealTemplateId: z.string().optional(),
  name: z.string().nullable().optional(),
  orderIndex: z.number().int().nonnegative().optional(),
});


/* =========================
   MEAL OPTIONS (DELETE)
========================= */
const ClientMenuMealOptionDeleteDto = z.object({
  id: z.string(),
});

/* =========================
   MEAL OPTION ITEMS
========================= */
const ClientMenuMealOptionItemAddDto = z.object({
  foodItemId: z.string(),
  role: z.string(),
  grams: z.number().positive().optional(),
});

const ClientMenuMealOptionItemUpdateDto = z.object({
  id: z.string(),
  role: z.string().optional(),
  grams: z.number().positive().optional(),
});

const ClientMenuMealOptionItemDeleteDto = z.object({
  id: z.string(),
});


/* =========================
   MEAL OPTIONS (UPDATE)
========================= */
const ClientMenuMealOptionUpdateDto = z.object({
  id: z.string(),

  name: z.string().nullable().optional(),
  orderIndex: z.number().int().nonnegative().optional(),

  itemsToAdd: z.array(ClientMenuMealOptionItemAddDto).optional(),
  itemsToUpdate: z.array(ClientMenuMealOptionItemUpdateDto).optional(),
  itemsToDelete: z.array(ClientMenuMealOptionItemDeleteDto).optional(),
});



/* =========================
   MEALS
========================= */
const ClientMenuMealAddDto = z.object({
  name: z.string().min(1),
  notes: z.string().nullable().optional(),
  totalCalories: z.number(),
});

const ClientMenuMealUpdateDto = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  notes: z.string().nullable().optional(),
  totalCalories: z.number().optional(),
  selectedOptionId: z.string().nullable().optional(),

  
  optionsToAdd: z.array(ClientMenuMealOptionAddDto).optional(),
  optionsToUpdate: z.array(ClientMenuMealOptionUpdateDto).optional(),
  optionsToDelete: z.array(ClientMenuMealOptionDeleteDto).optional(),
});

const ClientMenuMealDeleteDto = z.object({
  id: z.string(),
});



/* =========================
   VITAMINS
========================= */
const ClientMenuVitaminAddDto = z.object({
  vitaminId: z.string().nullable().optional(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

const ClientMenuVitaminUpdateDto = z.object({
  id: z.string(),
  vitaminId: z.string().nullable().optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

const ClientMenuVitaminDeleteDto = z.object({
  id: z.string(),
});

/* =========================
   UPDATE ClientMenu
========================= */
export const ClientMenuUpdateRequestDto = z.object({
  name: z.string().min(1).optional(),
  type: z.string().optional(),
  notes: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  startDate: IsoDate.nullable().optional(),
  endDate: IsoDate.nullable().optional(),

  mealsToAdd: z.array(ClientMenuMealAddDto).optional(),
  mealsToUpdate: z.array(ClientMenuMealUpdateDto).optional(),
  mealsToDelete: z.array(ClientMenuMealDeleteDto).optional(),

  vitaminsToAdd: z.array(ClientMenuVitaminAddDto).optional(),
  vitaminsToUpdate: z.array(ClientMenuVitaminUpdateDto).optional(),
  vitaminsToDelete: z.array(ClientMenuVitaminDeleteDto).optional(),
});

/* =========================
   LIST QUERY
========================= */
export const ClientMenuListQueryDto = z.object({
  includeInactive: z.string().optional(),
  clientId: z.string().optional(),
  coachId: z.string().optional(),
});

/* =========================
   CREATE FROM TEMPLATE
========================= */
export const ClientMenuCreateFromTemplateRequestDto = z.object({
  templateMenuId: z.string(),
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

/* =========================
   RESPONSE
========================= */
export const ClientMenuResponseDto = z.object({
  id: z.string(),
  clientId: z.string(),
  coachId: z.string(),

  name: z.string(),
  type: z.string(),

  notes: z.string().nullable(),
  isActive: z.boolean(),

  startDate: z.string().nullable(),
  endDate: z.string().nullable(),

  totalCalories: z.number(),

  meals: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      notes: z.string().nullable(),
      totalCalories: z.number(),
      selectedOptionId: z.string().nullable(),

      options: z.array(
        z.object({
          id: z.string(),
          name: z.string().nullable(),
          orderIndex: z.number(),

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
      notes: z.string().nullable(),
    })
  ),
});

export const ClientMenuListResponseDto = z.object({
  data: z.array(ClientMenuResponseDto),
});
