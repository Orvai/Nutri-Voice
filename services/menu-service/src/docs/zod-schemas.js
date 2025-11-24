const { z } = require('zod');
const {
  FoodItemCreateRequestDto,
  FoodItemUpdateRequestDto,
  FoodItemResponseDto,
} = require('../dto/food.dto');
const {
  MealTemplateCreateRequestDto,
  MealTemplateUpdateRequestDto,
  MealTemplateItemInputDto,
  MealTemplateResponseDto,
} = require('../dto/mealTemplate.dto');
const {
  DailyMenuTemplateCreateRequestDto,
  DailyMenuTemplateUpdateRequestDto,
  DailyMenuTemplateResponseDto,
} = require('../dto/dailyMenu.dto');
const {
  ClientMenuCreateRequestDto,
  ClientMenuUpdateRequestDto,
  ClientMenuResponseDto,
} = require('../dto/clientMenu.dto');

function toJsonSchema(dto, name) {
  const schema = z.toJSONSchema(dto, {
    unrepresentable: 'any',
    override: (ctx) => {
      const def = ctx.zodSchema?._zod?.def;
      if (def && def.type === 'date') {
        ctx.jsonSchema.type = 'string';
        ctx.jsonSchema.format = 'date-time';
      }
    },
  });
  return { title: name, ...schema };
}

const FoodItemCreateRequestSchema = toJsonSchema(
  FoodItemCreateRequestDto,
  'FoodItemCreateRequestDto',
);
const FoodItemUpdateRequestSchema = toJsonSchema(
  FoodItemUpdateRequestDto,
  'FoodItemUpdateRequestDto',
);
const FoodItemResponseSchema = toJsonSchema(
  FoodItemResponseDto,
  'FoodItemResponseDto',
);

const MealTemplateCreateRequestSchema = toJsonSchema(
  MealTemplateCreateRequestDto,
  'MealTemplateCreateRequestDto',
);
const MealTemplateUpdateRequestSchema = toJsonSchema(
  MealTemplateUpdateRequestDto,
  'MealTemplateUpdateRequestDto',
);
const MealTemplateItemInputSchema = toJsonSchema(
  MealTemplateItemInputDto,
  'MealTemplateItemInputDto',
);
const MealTemplateResponseSchema = toJsonSchema(
  MealTemplateResponseDto,
  'MealTemplateResponseDto',
);

const DailyMenuTemplateCreateRequestSchema = toJsonSchema(
  DailyMenuTemplateCreateRequestDto,
  'DailyMenuTemplateCreateRequestDto',
);
const DailyMenuTemplateUpdateRequestSchema = toJsonSchema(
  DailyMenuTemplateUpdateRequestDto,
  'DailyMenuTemplateUpdateRequestDto',
);
const DailyMenuTemplateResponseSchema = toJsonSchema(
  DailyMenuTemplateResponseDto,
  'DailyMenuTemplateResponseDto',
);

const ClientMenuCreateRequestSchema = toJsonSchema(
  ClientMenuCreateRequestDto,
  'ClientMenuCreateRequestDto',
);
const ClientMenuUpdateRequestSchema = toJsonSchema(
  ClientMenuUpdateRequestDto,
  'ClientMenuUpdateRequestDto',
);
const ClientMenuResponseSchema = toJsonSchema(
  ClientMenuResponseDto,
  'ClientMenuResponseDto',
);

module.exports = {
  FoodItemCreateRequestDto: FoodItemCreateRequestSchema,
  FoodItemUpdateRequestDto: FoodItemUpdateRequestSchema,
  FoodItemResponseDto: FoodItemResponseSchema,
  MealTemplateCreateRequestDto: MealTemplateCreateRequestSchema,
  MealTemplateUpdateRequestDto: MealTemplateUpdateRequestSchema,
  MealTemplateItemInputDto: MealTemplateItemInputSchema,
  MealTemplateResponseDto: MealTemplateResponseSchema,
  DailyMenuTemplateCreateRequestDto: DailyMenuTemplateCreateRequestSchema,
  DailyMenuTemplateUpdateRequestDto: DailyMenuTemplateUpdateRequestSchema,
  DailyMenuTemplateResponseDto: DailyMenuTemplateResponseSchema,
  ClientMenuCreateRequestDto: ClientMenuCreateRequestSchema,
  ClientMenuUpdateRequestDto: ClientMenuUpdateRequestSchema,
  ClientMenuResponseDto: ClientMenuResponseSchema,
};