const { z } = require("zod");
const { TemplateMealOptionCreateDto, TemplateMealOptionUpsertDto } = require("./options.dto");
const { MealItemCreateDto, MealItemUpdateDto, MealItemDeleteDto } = require("./items.dto");

const TemplateMealCreateDto = z
  .object({
    name: z.string().min(1),
    options: z.array(TemplateMealOptionCreateDto).optional(),
  })
  .strict();

const TemplateMealAddDto = z
  .object({
    name: z.string().min(1),
    totalCalories: z.number().nullable().optional(),
    orderIndex: z.number().int().nonnegative().optional(),
  })
  .strict();

const TemplateMealUpdateDto = z
  .object({
    id: z.string(),
    name: z.string().min(1).optional(),
    selectedOptionId: z.string().nullable().optional(),
    totalCalories: z.number().nullable().optional(),
  })
  .strict();

const TemplateMealDeleteDto = z.object({ id: z.string() }).strict();

const ClientMealUpdateDto = z
  .object({
    id: z.string(),
    name: z.string().min(1).optional(),
    selectedOptionId: z.string().nullable().optional(),
    totalCalories: z.number().nullable().optional(),
    itemsToAdd: z.array(MealItemCreateDto).optional(),
    itemsToUpdate: z.array(MealItemUpdateDto).optional(),
    itemsToDelete: z.array(MealItemDeleteDto).optional(),
  })
  .strict();

const ClientMealDeleteDto = z.object({ id: z.string() }).strict();

const ClientMealFromTemplateDto = z
  .object({
    templateId: z.string(),
    name: z.string().min(1).optional(),
  })
  .strict();

module.exports = {
  ClientMealDeleteDto,
  ClientMealFromTemplateDto,
  ClientMealUpdateDto,
  TemplateMealAddDto,
  TemplateMealCreateDto,
  TemplateMealDeleteDto,
  TemplateMealUpdateDto,
  TemplateMealOptionCreateDto,
  TemplateMealOptionUpsertDto,
};