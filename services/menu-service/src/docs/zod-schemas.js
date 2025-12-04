// src/docs/zod-schemas.js

const { zodToJsonSchema } = require("zod-to-json-schema");

/* ============================
   IMPORT DTOs (Zod Schemas)
   ============================ */

const {
  FoodItemCreateRequestDto,
  FoodItemUpdateRequestDto,
  FoodItemResponseDto,
} = require("../dto/food.dto");

const {
  MealTemplateCreateDto,
  MealTemplateUpsertDto,
  MealTemplateResponseDto,
} = require("../dto/mealTemplate.dto");

const {
  ClientMenuCreateRequestDto,
  ClientMenuUpdateRequestDto,
  ClientMenuResponseDto,
} = require("../dto/clientMenu.dto");


/* ============================
   JSON SCHEMAS GENERATION
   ============================ */

function make(name, schema) {
  return zodToJsonSchema(schema, name);
}

/* FOOD */
const FoodItemCreateRequestSchema = make(
  "FoodItemCreateRequestDto",
  FoodItemCreateRequestDto
);
const FoodItemUpdateRequestSchema = make(
  "FoodItemUpdateRequestDto",
  FoodItemUpdateRequestDto
);
const FoodItemResponseSchema = make(
  "FoodItemResponseDto",
  FoodItemResponseDto
);

/* MEAL TEMPLATE */
const MealTemplateCreateSchema = make(
  "MealTemplateCreateDto",
  MealTemplateCreateDto
);
const MealTemplateUpdateSchema = make(
  "MealTemplateUpsertDto",
  MealTemplateUpsertDto
);
const MealTemplateResponseSchema = make(
  "MealTemplateResponseDto",
  MealTemplateResponseDto
);

/* CLIENT MENU */
const ClientMenuCreateRequestSchema = make(
  "ClientMenuCreateRequestDto",
  ClientMenuCreateRequestDto
);
const ClientMenuUpdateRequestSchema = make(
  "ClientMenuUpdateRequestDto",
  ClientMenuUpdateRequestDto
);
const ClientMenuResponseSchema = make(
  "ClientMenuResponseDto",
  ClientMenuResponseDto
);

/* ============================
   EXPORT
   ============================ */

module.exports = {
  FoodItemCreateRequestDto: FoodItemCreateRequestSchema,
  FoodItemUpdateRequestDto: FoodItemUpdateRequestSchema,
  FoodItemResponseDto: FoodItemResponseSchema,

  MealTemplateCreateDto: MealTemplateCreateSchema,
  MealTemplateUpsertDto: MealTemplateUpdateSchema,
  MealTemplateResponseDto: MealTemplateResponseSchema,

  ClientMenuCreateRequestDto: ClientMenuCreateRequestSchema,
  ClientMenuUpdateRequestDto: ClientMenuUpdateRequestSchema,
  ClientMenuResponseDto: ClientMenuResponseSchema,
};
