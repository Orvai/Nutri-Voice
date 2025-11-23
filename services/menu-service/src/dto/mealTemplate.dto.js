// src/dto/mealTemplate.dto.js
const { z } = require("zod");

const MealItemRoleEnum = z.enum([
  "PROTEIN",
  "CARB",
  "FREE",
  "HEALTH",
  "MENTAL_HEALTH",
]);

const MealTemplateKindEnum = z.enum([
  "MEAT_MEAL",
  "DAIRY_MEAL",
  "FREE_CALORIES",
  "CARB_LOAD",
]);

const MealTemplateItemInputDto = z.object({
  foodItemId: z.string().min(1),
  role: MealItemRoleEnum,
  defaultGrams: z.number().optional(),
  defaultCalories: z.number().optional(),
  notes: z.string().optional(),
});

const MealTemplateCreateRequestDto = z.object({
  name: z.string().min(2),
  kind: MealTemplateKindEnum,
  items: z.array(MealTemplateItemInputDto).min(1),
});

const MealTemplateUpdateRequestDto = z.object({
  name: z.string().optional(),
  kind: MealTemplateKindEnum.optional(),
  items: z.array(MealTemplateItemInputDto).optional(),
});

const MealTemplateResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  kind: MealTemplateKindEnum,
  coachId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(
    z.object({
      id: z.string(),
      foodItemId: z.string(),
      role: MealItemRoleEnum,
      defaultGrams: z.number().nullable(),
      defaultCalories: z.number().nullable(),
      notes: z.string().nullable(),
      createdAt: z.date(),
    })
  ),
});

module.exports = {
  MealItemRoleEnum,
  MealTemplateKindEnum,
  MealTemplateItemInputDto,
  MealTemplateCreateRequestDto,
  MealTemplateUpdateRequestDto,
  MealTemplateResponseDto,
};
