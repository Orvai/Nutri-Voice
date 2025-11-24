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
  foodItemId: z.string(),
  role: MealItemRoleEnum,
  defaultGrams: z.number().optional(),
  defaultCalories: z.number().optional(),
  notes: z.string().optional(),
});

const MealTemplateItemUpdateDto = z.object({
  id: z.string(),
  foodItemId: z.string().optional(),
  role: MealItemRoleEnum.optional(),
  defaultGrams: z.number().optional(),
  defaultCalories: z.number().optional(),
  notes: z.string().optional(),
});

const MealTemplateItemDeleteDto = z.object({
  id: z.string(),
});

const MealTemplateCreateRequestDto = z.object({
  name: z.string().min(2),
  kind: MealTemplateKindEnum,
  totalCalories: z.number().positive(),
  items: z.array(MealTemplateItemInputDto).optional(),
});

const MealTemplateUpdateRequestDto = z.object({
  name: z.string().optional(),
  kind: MealTemplateKindEnum.optional(),
  totalCalories: z.number().optional(),

  itemsToAdd: z.array(MealTemplateItemInputDto).optional(),
  itemsToUpdate: z.array(MealTemplateItemUpdateDto).optional(),
  itemsToDelete: z.array(MealTemplateItemDeleteDto).optional(),
});


const MealTemplateItemResponseDto = z.object({
  id: z.string(),
  foodItemId: z.string(),
  role: MealItemRoleEnum,
  defaultGrams: z.number().nullable(),
  defaultCalories: z.number().nullable(),
  notes: z.string().nullable().optional(),
});

const MealTemplateResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  kind: MealTemplateKindEnum,
  totalCalories: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(MealTemplateItemResponseDto),
});


module.exports = {
  MealItemRoleEnum,
  MealTemplateKindEnum,
  MealTemplateItemInputDto,
  MealTemplateItemUpdateDto,
  MealTemplateItemDeleteDto,
  MealTemplateCreateRequestDto,
  MealTemplateUpdateRequestDto,
  MealTemplateResponseDto
};
