const { z } = require("zod");

const TemplateMealOptionCreateDto = z
  .object({
    mealTemplateId: z.string(),
    name: z.string().nullable().optional(),
    orderIndex: z.number().int().nonnegative().optional(),
  })
  .strict();

const TemplateMealOptionUpsertDto = z
  .object({
    mealId: z.string(),
    mealTemplateId: z.string().optional(),
    name: z.string().nullable().optional(),
    orderIndex: z.number().int().nonnegative().optional(),
  })
  .strict();

const MealOptionSelectionDto = z
  .object({
    templateMealId: z.string(),
    optionId: z.string(),
  })
  .strict();

const MealOptionDeleteDto = z.object({ id: z.string() }).strict();

module.exports = {
  MealOptionSelectionDto,
  MealOptionDeleteDto,
  TemplateMealOptionCreateDto,
  TemplateMealOptionUpsertDto,
};