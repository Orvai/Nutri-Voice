const { z } = require("zod");
const {
  TemplateMealCreateDto,
  TemplateMealAddDto,
  TemplateMealUpdateDto,
  TemplateMealDeleteDto,
  TemplateMealOptionUpsertDto,
} = require("./meals.dto");
const { TemplateMealOptionCreateDto, MealOptionDeleteDto } = require("./options.dto");
const { TemplateMenuVitaminDto, VitaminCreateDto } = require("./vitamin.dto");

const TemplateMenuCreateDto = z
  .object({
    name: z.string().min(1),
    dayType: z.string(),
    notes: z.string().nullable().optional(),
    meals: z.array(TemplateMealCreateDto).optional(),
    vitamins: z.array(
      VitaminCreateDto.extend({ vitaminId: z.string().nullable().optional() }).strict()
    ).optional(),
  })
  .strict();

const TemplateMenuUpdateDto = z
  .object({
    name: z.string().min(1).optional(),
    dayType: z.string().optional(),
    notes: z.string().nullable().optional(),
    totalCalories: z.number().optional(),
    mealsToAdd: z.array(TemplateMealAddDto).optional(),
    mealsToUpdate: z.array(TemplateMealUpdateDto).optional(),
    mealsToDelete: z.array(TemplateMealDeleteDto).optional(),
    mealOptionsToAdd: z.array(TemplateMealOptionUpsertDto).optional(),
    mealOptionsToDelete: z.array(MealOptionDeleteDto).optional(),
    vitaminsToAdd: z
      .array(
        VitaminCreateDto.extend({ vitaminId: z.string() })
          .strict()
      )
      .optional(),
    vitaminsToDelete: z.array(TemplateMenuVitaminDto.pick({ id: true })).optional(),
  })
  .strict();

const TemplateMenuResponseDto = z
  .object({
    id: z.string(),
    coachId: z.string(),
    name: z.string(),
    dayType: z.string(),
    notes: z.string().nullable(),
    totalCalories: z.number(),
    meals: z.array(
      z
        .object({
          id: z.string(),
          name: z.string(),
          totalCalories: z.number().nullable().optional(),
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
                    totalCalories: z.number().nullable().optional(),
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
        })
        .strict()
    ),
    vitamins: z.array(TemplateMenuVitaminDto),
  })
  .strict();

const TemplateMenuListQueryDto = z
  .object({
    coachId: z.string().optional(),
  })
  .strict();

module.exports = {
  TemplateMenuCreateDto,
  TemplateMenuUpdateDto,
  TemplateMenuResponseDto,
  TemplateMenuListQueryDto,
  TemplateMealOptionCreateDto,
};
