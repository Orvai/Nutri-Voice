const { z } = require("zod");
const {
  ClientMealDeleteDto,
  ClientMealFromTemplateDto,
  ClientMealUpdateDto,
} = require("./meals.dto.js");
const { MealItemCreateDto, MealItemUpdateDto, MealItemDeleteDto } = require("./items.dto");
const {
  TemplateMealOptionUpsertDto,
  MealOptionDeleteDto,
  MealOptionSelectionDto,
} = require("./options.dto");
const { ClientMenuVitaminDto, VitaminCreateDto, VitaminUpdateDto } = require("./vitamin.dto");

const dateString = z.string().datetime({ offset: true }).or(z.string());

const ClientMenuCreateRequestDto = z
  .object({
    name: z.string(),
    type: z.string(),
    notes: z.string().nullable().optional(),
    startDate: dateString.optional(),
    endDate: dateString.optional(),
  })
  .strict();

const ClientMenuUpdateRequestDto = z
  .object({
    name: z.string().optional(),
    type: z.string().optional(),
    notes: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    mealId: z.string().optional(),
    mealTemplateId: z.string().optional(),
    mealsToAdd: z.array(ClientMealFromTemplateDto).optional(),
    mealsToUpdate: z.array(ClientMealUpdateDto).optional(),
    mealsToDelete: z.array(ClientMealDeleteDto).optional(),
    mealOptionsToAdd: z.array(TemplateMealOptionUpsertDto).optional(),
    mealOptionsToDelete: z.array(MealOptionDeleteDto).optional(),
    itemsToAdd: z.array(MealItemCreateDto).optional(),
    itemsToUpdate: z.array(MealItemUpdateDto).optional(),
    itemsToDelete: z.array(MealItemDeleteDto).optional(),
    vitaminsToAdd: z.array(VitaminCreateDto.extend({ vitaminId: z.string().nullable().optional() }).strict()).optional(),
    vitaminsToUpdate: z
      .array(
        VitaminUpdateDto.extend({ id: z.string(), vitaminId: z.string().nullable().optional() })
          .strict()
      )
      .optional(),
    vitaminsToDelete: z.array(ClientMenuVitaminDto.pick({ id: true })).optional(),
  })
  .strict();

const ClientMenuCreateFromTemplateDto = z
  .object({
    templateMenuId: z.string(),
    name: z.string().optional(),
    selectedOptions: z.array(MealOptionSelectionDto).optional(),
  })
  .strict();

const ClientMenuResponseDto = z
  .object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    notes: z.string().nullable(),
    isActive: z.boolean(),
    meals: z.array(
      z
        .object({
          id: z.string(),
          name: z.string(),
          selectedOptionId: z.string().nullable(),
          options: z.array(
            z
              .object({
                id: z.string(),
                name: z.string().nullable(),
                orderIndex: z.number(),
                mealTemplate: z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    kind: z.string(),
                    items: z.array(
                      z
                        .object({
                          id: z.string(),
                          role: z.string(),
                          defaultGrams: z.number(),
                          notes: z.string().nullable(),
                          foodItem: z
                            .object({
                              id: z.string(),
                              name: z.string(),
                              caloriesPer100g: z.number().nullable(),
                            })
                            .strict(),
                        })
                        .strict()
                    ),
                  })
                  .strict(),
              })
              .strict()
          ),
          items: z.array(
            z
              .object({
                id: z.string(),
                quantity: z.number(),
                calories: z.number(),
                notes: z.string().nullable(),
                foodItem: z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    caloriesPer100g: z.number().nullable(),
                  })
                  .strict(),
              })
              .strict()
          ),
        })
        .strict()
    ),
    vitamins: z.array(ClientMenuVitaminDto),
  })
  .strict();

const ClientMenuListQueryDto = z
  .object({
    includeInactive: z.string().optional(),
    clientId: z.string().optional(),
    coachId: z.string().optional(),
  })
  .strict();

module.exports = {
  ClientMenuCreateRequestDto,
  ClientMenuUpdateRequestDto,
  ClientMenuCreateFromTemplateDto,
  ClientMenuResponseDto,
  ClientMenuListQueryDto,
};