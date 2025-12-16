const { z } = require("zod");

const isoDateString = z.string();

/* =========================
   CREATE
========================= */
const ClientMenuCreateDto = z
  .object({
    name: z.string().min(1),
    type: z.string(),
    notes: z.string().nullable().optional(),
    startDate: isoDateString.optional(),
    endDate: isoDateString.optional(),
  })
  .strict();

/* =========================
   MEALS
========================= */
const ClientMenuMealAddDto = z
  .object({
    name: z.string().min(1),
    notes: z.string().nullable().optional(),
    totalCalories: z.number(),
  })
  .strict();

const ClientMenuMealUpdateDto = z
  .object({
    id: z.string(),
    name: z.string().min(1).optional(),
    notes: z.string().nullable().optional(),
    totalCalories: z.number().optional(),
    selectedOptionId: z.string().nullable().optional(),
  })
  .strict();

const ClientMenuMealDeleteDto = z.object({ id: z.string() }).strict();

/* =========================
   MEAL OPTIONS
========================= */
const ClientMenuMealOptionItemDto = z
  .object({
    foodItemId: z.string(),
    role: z.string(),
    grams: z.number().positive().optional(),
  })
  .strict();

const ClientMenuMealOptionDto = z
  .object({
    mealId: z.string(),
    mealTemplateId: z.string().optional(),
    name: z.string().nullable().optional(),
    orderIndex: z.number().int().nonnegative().optional(),
    items: z.array(ClientMenuMealOptionItemDto).min(1),
  })
  .strict();

const ClientMenuMealOptionDeleteDto = z
  .object({ id: z.string() })
  .strict();

/* =========================
   VITAMINS
========================= */
const ClientMenuVitaminAddDto = z
  .object({
    vitaminId: z.string().nullable().optional(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .strict();

const ClientMenuVitaminUpdateDto = z
  .object({
    id: z.string(),
    vitaminId: z.string().nullable().optional(),
    name: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .strict();

const ClientMenuVitaminDeleteDto = z
  .object({ id: z.string() })
  .strict();

/* =========================
   UPDATE
========================= */
const ClientMenuUpdateDto = z
  .object({
    name: z.string().min(1).optional(),
    type: z.string().optional(),
    notes: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
    startDate: isoDateString.nullable().optional(),
    endDate: isoDateString.nullable().optional(),

    mealsToAdd: z.array(ClientMenuMealAddDto).optional(),
    mealsToUpdate: z.array(ClientMenuMealUpdateDto).optional(),
    mealsToDelete: z.array(ClientMenuMealDeleteDto).optional(),

    mealOptionsToAdd: z.array(ClientMenuMealOptionDto).optional(),
    mealOptionsToDelete: z.array(ClientMenuMealOptionDeleteDto).optional(),

    vitaminsToAdd: z.array(ClientMenuVitaminAddDto).optional(),
    vitaminsToUpdate: z.array(ClientMenuVitaminUpdateDto).optional(),
    vitaminsToDelete: z.array(ClientMenuVitaminDeleteDto).optional(),
  })
  .strict();

/* =========================
   LIST
========================= */
const ClientMenuListQueryDto = z
  .object({
    includeInactive: z.string().optional(),
    clientId: z.string().optional(),
    coachId: z.string().optional(),
  })
  .strict();

/* =========================
   CREATE FROM TEMPLATE
========================= */
const ClientMenuCreateFromTemplateDto = z
  .object({
    templateMenuId: z.string(),
    name: z.string().optional(),
    selectedOptions: z
      .array(
        z
          .object({
            templateMealId: z.string(),
            optionId: z.string(),
          })
          .strict()
      )
      .optional(),
  })
  .strict();

module.exports = {
  ClientMenuCreateDto,
  ClientMenuUpdateDto,
  ClientMenuListQueryDto,
  ClientMenuCreateFromTemplateDto,
};
