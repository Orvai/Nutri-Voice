// src/docs/zod-schemas.js
const { z } = require("zod");

const {
  FoodItemCreateRequestDto,
  FoodItemUpdateRequestDto,
  FoodItemResponseDto,
} = require("../dto/food.dto");

const {
  MealTemplateCreateRequestDto,
  MealTemplateUpdateRequestDto,
  MealTemplateItemInputDto,
  MealTemplateItemUpdateDto,
  MealTemplateItemDeleteDto,
  MealTemplateResponseDto,
} = require("../dto/mealTemplate.dto");

const {
  ClientMenuCreateRequestDto,
  ClientMenuUpdateRequestDto,
  ClientMenuResponseDto,
} = require("../dto/clientMenu.dto");

function toJsonSchema(dto, name) {
  const schema = z.toJSONSchema(dto, {
    unrepresentable: "any",
    override: (ctx) => {
      const def = ctx.zodSchema?._zod?.def;
      if (def && def.type === "date") {
        ctx.jsonSchema.type = "string";
        ctx.jsonSchema.format = "date-time";
      }
    },
  });

  return { title: name, ...schema };
}

/* FOOD */
const FoodItemCreateRequestSchema = toJsonSchema(
  FoodItemCreateRequestDto,
  "FoodItemCreateRequestDto"
);
const FoodItemUpdateRequestSchema = toJsonSchema(
  FoodItemUpdateRequestDto,
  "FoodItemUpdateRequestDto"
);
const FoodItemResponseSchema = toJsonSchema(
  FoodItemResponseDto,
  "FoodItemResponseDto"
);

/* MEAL TEMPLATE */
const MealTemplateCreateRequestSchema = toJsonSchema(
  MealTemplateCreateRequestDto,
  "MealTemplateCreateRequestDto"
);
const MealTemplateUpdateRequestSchema = toJsonSchema(
  MealTemplateUpdateRequestDto,
  "MealTemplateUpdateRequestDto"
);
const MealTemplateItemInputSchema = toJsonSchema(
  MealTemplateItemInputDto,
  "MealTemplateItemInputDto"
);
const MealTemplateItemUpdateSchema = toJsonSchema(
  MealTemplateItemUpdateDto,
  "MealTemplateItemUpdateDto"
);
const MealTemplateItemDeleteSchema = toJsonSchema(
  MealTemplateItemDeleteDto,
  "MealTemplateItemDeleteDto"
);
const MealTemplateResponseSchema = toJsonSchema(
  MealTemplateResponseDto,
  "MealTemplateResponseDto"
);

/* CLIENT MENU */
const ClientMenuCreateRequestSchema = toJsonSchema(
  ClientMenuCreateRequestDto,
  "ClientMenuCreateRequestDto"
);
const ClientMenuUpdateRequestSchema = toJsonSchema(
  ClientMenuUpdateRequestDto,
  "ClientMenuUpdateRequestDto"
);
const ClientMenuResponseSchema = toJsonSchema(
  ClientMenuResponseDto,
  "ClientMenuResponseDto"
);

module.exports = {
  FoodItemCreateRequestDto: FoodItemCreateRequestSchema,
  FoodItemUpdateRequestDto: FoodItemUpdateRequestSchema,
  FoodItemResponseDto: FoodItemResponseSchema,

  MealTemplateCreateRequestDto: MealTemplateCreateRequestSchema,
  MealTemplateUpdateRequestDto: MealTemplateUpdateRequestSchema,
  MealTemplateItemInputDto: MealTemplateItemInputSchema,
  MealTemplateItemUpdateDto: MealTemplateItemUpdateSchema,
  MealTemplateItemDeleteDto: MealTemplateItemDeleteSchema,
  MealTemplateResponseDto: MealTemplateResponseSchema,

  ClientMenuCreateRequestDto: ClientMenuCreateRequestSchema,
  ClientMenuUpdateRequestDto: ClientMenuUpdateRequestSchema,
  ClientMenuResponseDto: ClientMenuResponseSchema,
};
