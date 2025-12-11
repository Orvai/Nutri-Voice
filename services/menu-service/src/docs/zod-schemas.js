const { z } = require('zod');
const { FoodItemCreateRequestDto, FoodItemUpdateRequestDto, FoodItemResponseDto } = require('../dto/food.dto');
const { MealTemplateCreateDto, MealTemplateUpsertDto, MealTemplateResponseDto } = require('../dto/mealTemplate.dto');
const { ClientMenuCreateRequestDto, ClientMenuCreateFromTemplateDto, ClientMenuUpdateRequestDto, ClientMenuResponseDto } = require('../dto/clientMenu.dto');
const { TemplateMenuCreateDto, TemplateMenuUpdateDto, TemplateMenuResponseDto } = require('../dto/templateMenu.dto');
const { VitaminCreateDto, VitaminUpdateDto, VitaminResponseDto, TemplateMenuVitaminDto } = require('../dto/vitamin.dto');

function toJsonSchema(name, schema) {
  const json = z.toJSONSchema(schema, {
    unrepresentable: 'any',
    override: (ctx) => {
      const def = ctx.zodSchema?._zod?.def;
      if (def && def.type === 'date') {
        ctx.jsonSchema.type = 'string';
        ctx.jsonSchema.format = 'date-time';
      }
    },
  });
  return { title: name, ...json };
}

const schemas = {
  // Requests
  Menu_FoodItemCreateRequestDto: FoodItemCreateRequestDto,
  Menu_FoodItemUpdateRequestDto: FoodItemUpdateRequestDto,
  Menu_MealTemplateCreateDto: MealTemplateCreateDto,
  Menu_MealTemplateUpsertDto: MealTemplateUpsertDto,
  Menu_ClientMenuCreateRequestDto: ClientMenuCreateRequestDto,
  Menu_ClientMenuCreateFromTemplateDto: ClientMenuCreateFromTemplateDto,
  Menu_ClientMenuUpdateRequestDto: ClientMenuUpdateRequestDto,
  Menu_TemplateMenuCreateDto: TemplateMenuCreateDto,
  Menu_TemplateMenuUpdateDto: TemplateMenuUpdateDto,
  Menu_VitaminCreateDto: VitaminCreateDto,
  Menu_VitaminUpdateDto: VitaminUpdateDto,

  // Responses
  Menu_FoodItemResponseDto: FoodItemResponseDto,
  Menu_MealTemplateResponseDto: MealTemplateResponseDto,
  Menu_ClientMenuResponseDto: ClientMenuResponseDto,
  Menu_TemplateMenuResponseDto: TemplateMenuResponseDto,
  Menu_VitaminResponseDto: VitaminResponseDto,
  Menu_TemplateMenuVitaminDto: TemplateMenuVitaminDto,
};

module.exports = Object.entries(schemas).reduce((acc, [name, schema]) => {
  acc[name] = toJsonSchema(name, schema);
  return acc;
}, {});