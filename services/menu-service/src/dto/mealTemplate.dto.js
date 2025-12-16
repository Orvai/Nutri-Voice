const { z } = require("zod");

/**
 * ENUMS
 * אם כבר קיימים enums משותפים – אפשר לייבא במקום string
 */
const MealTemplateKindEnum = z.string();
const MealItemRoleEnum = z.string();

/**
 * ============================
 * Items
 * ============================
 */

const MealTemplateItemCreateDto = z
  .object({
    foodItemId: z.string(),
    role: MealItemRoleEnum,
    grams: z.number().positive().optional(),
  })
  .strict();

const MealTemplateItemUpdateDto = z
  .object({
    id: z.string(),
    foodItemId: z.string().optional(),
    role: MealItemRoleEnum.optional(),
    grams: z.number().positive().optional(),
  })
  .strict();

/**
 * ============================
 * Create MealTemplate
 * (Gateway → menu-service)
 * ============================
 */
const MealTemplateCreateDto = z
  .object({
    coachId: z.string(), // injected by gateway

    name: z.string().min(1),
    kind: MealTemplateKindEnum,

    items: z.array(MealTemplateItemCreateDto).optional(),
  })
  .strict();

/**
 * ============================
 * Update MealTemplate
 * ============================
 */
const MealTemplateUpdateDto = z
  .object({
    name: z.string().min(1).optional(),
    kind: MealTemplateKindEnum.optional(),

    itemsToAdd: z.array(MealTemplateItemCreateDto).optional(),
    itemsToUpdate: z.array(MealTemplateItemUpdateDto).optional(),
    itemsToDelete: z
      .array(z.object({ id: z.string() }).strict())
      .optional(),
  })
  .strict();

/**
 * ============================
 * List Query
 * ============================
 */
const MealTemplateListQueryDto = z
  .object({
    coachId: z.string().optional(),
  })
  .strict();

module.exports = {
  MealTemplateCreateDto,
  MealTemplateUpdateDto,
  MealTemplateListQueryDto,
};
