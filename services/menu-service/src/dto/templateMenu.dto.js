// src/dto/templateMenu.dto.js
const { z } = require("zod");

/* =========================================================
   Shared enums / primitives
========================================================= */

const DayTypeEnum = z.enum(["TRAINING", "REST"]);

/* =========================================================
   CREATE – Template Menu
========================================================= */

const TemplateMenuMealOptionCreateDto = z.object({
  mealTemplateId: z.string().optional(),
  name: z.string().nullable().optional(),
  orderIndex: z.number().int().nonnegative().optional(),
});

const TemplateMenuMealCreateDto = z.object({
  name: z.string().min(1),
  notes: z.string().nullable().optional(),
  totalCalories: z.number().nonnegative().optional(),
  options: z.array(TemplateMenuMealOptionCreateDto).optional(),
});

const TemplateMenuVitaminCreateDto = z.object({
  vitaminId: z.string().nullable().optional(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
});

const createTemplateMenuDTO = z
  .object({
    name: z.string().min(1),
    dayType: DayTypeEnum,
    notes: z.string().nullable().optional(),
    meals: z.array(TemplateMenuMealCreateDto).optional(),
    vitamins: z.array(TemplateMenuVitaminCreateDto).optional(),
  })
  .strict();

/* =========================================================
   UPDATE – Template Menu
========================================================= */

/* ---------- Vitamins ---------- */

const TemplateMenuVitaminDeleteDto = z.object({
  id: z.string(),
});

const TemplateMenuVitaminAddDto = TemplateMenuVitaminCreateDto;

/* ---------- Meals ---------- */

const TemplateMenuMealDeleteDto = z.object({
  id: z.string(),
});

const TemplateMenuMealAddDto = z.object({
  name: z.string().min(1),
  notes: z.string().nullable().optional(),
  totalCalories: z.number().nonnegative().optional(),
});

const TemplateMenuMealUpdateDto = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  notes: z.string().nullable().optional(),
  totalCalories: z.number().nonnegative().optional(),
});

/* ---------- Meal Options ---------- */

const MealTemplateInlineCreateDto = z.object({
  name: z.string().min(1),
  kind: z.string().optional(),
  items: z.array(
    z.object({
      foodItemId: z.string(),
      role: z.string(),
      grams: z.number().positive().optional(),
    })
  ).optional(),
});

const TemplateMenuMealOptionDeleteDto = z.object({
  id: z.string(),
});

const TemplateMenuMealOptionAddDto = z.object({
  mealId: z.string(),
  mealTemplateId: z.string().optional(),
  name: z.string().nullable().optional(),
  orderIndex: z.number().int().nonnegative().optional(),

  // required ONLY when mealTemplateId is missing
  template: MealTemplateInlineCreateDto.optional(),
});

/* ---------- Update Root ---------- */

const updateTemplateMenuDTO = z
  .object({
    // basic fields
    name: z.string().min(1).optional(),
    dayType: DayTypeEnum.optional(),
    notes: z.string().nullable().optional(),

    // vitamins
    vitaminsToDelete: z.array(TemplateMenuVitaminDeleteDto).optional(),
    vitaminsToAdd: z.array(TemplateMenuVitaminAddDto).optional(),

    // meals
    mealsToDelete: z.array(TemplateMenuMealDeleteDto).optional(),
    mealsToAdd: z.array(TemplateMenuMealAddDto).optional(),
    mealsToUpdate: z.array(TemplateMenuMealUpdateDto).optional(),

    // meal options
    mealOptionsToDelete: z.array(TemplateMenuMealOptionDeleteDto).optional(),
    mealOptionsToAdd: z.array(TemplateMenuMealOptionAddDto).optional(),
  })
  .strict();

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  createTemplateMenuDTO,
  updateTemplateMenuDTO,
};
