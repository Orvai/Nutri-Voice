// src/docs/zod-schemas.js
// Converts Zod DTOs → JSON Schema for Swagger using zod-to-json-schema

const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

// ====== DTO Imports ======
const {
  FoodItemCreateRequestDto,
  FoodItemUpdateRequestDto,
  FoodItemResponseDto,
} = require("../dto/food.dto");

const {
  MealTemplateCreateRequestDto,
  MealTemplateUpdateRequestDto,
  MealTemplateResponseDto,
} = require("../dto/mealTemplate.dto");

const {
  DailyMenuTemplateCreateRequestDto,
  DailyMenuTemplateUpdateRequestDto,
  DailyMenuTemplateResponseDto,
} = require("../dto/dailyMenu.dto");

const {
  ClientMenuCreateRequestDto,
  ClientMenuUpdateRequestDto,
  ClientMenuResponseDto,
} = require("../dto/clientMenu.dto");


// ====== Helper: Convert Zod → JSON Schema ======
function toJsonSchema(dto, name) {
  return zodToJsonSchema(dto, {
    name,
    target: "openApi3",
  });
}


// ====== Food Schemas ======
const FoodItemCreateInput = toJsonSchema(FoodItemCreateRequestDto, "FoodItemCreateRequestDto");
const FoodItemUpdateInput = toJsonSchema(FoodItemUpdateRequestDto, "FoodItemUpdateRequestDto");
const FoodItem = toJsonSchema(FoodItemResponseDto, "FoodItemResponseDto");


// ====== Meal Template Schemas ======
const MealTemplateCreateInput = toJsonSchema(MealTemplateCreateRequestDto, "MealTemplateCreateRequestDto");
const MealTemplateUpdateInput = toJsonSchema(MealTemplateUpdateRequestDto, "MealTemplateUpdateRequestDto");
const MealTemplate = toJsonSchema(MealTemplateResponseDto, "MealTemplateResponseDto");


// ====== Daily Menu Template Schemas ======
const DailyMenuTemplateCreateInput = toJsonSchema(DailyMenuTemplateCreateRequestDto, "DailyMenuTemplateCreateRequestDto");
const DailyMenuTemplateUpdateInput = toJsonSchema(DailyMenuTemplateUpdateRequestDto, "DailyMenuTemplateUpdateRequestDto");
const DailyMenuTemplate = toJsonSchema(DailyMenuTemplateResponseDto, "DailyMenuTemplateResponseDto");


// ====== Client Menu Schemas ======
const ClientMenuCreateInput = toJsonSchema(ClientMenuCreateRequestDto, "ClientMenuCreateRequestDto");
const ClientMenuUpdateInput = toJsonSchema(ClientMenuUpdateRequestDto, "ClientMenuUpdateRequestDto");
const ClientMenu = toJsonSchema(ClientMenuResponseDto, "ClientMenuResponseDto");


// ====== Export all schemas ======
module.exports = {
  // Food
  FoodItemCreateRequestDto: FoodItemCreateInput,
  FoodItemUpdateRequestDto: FoodItemUpdateInput,
  FoodItemResponseDto: FoodItem,

  // Meal Templates
  MealTemplateCreateRequestDto: MealTemplateCreateInput,
  MealTemplateUpdateRequestDto: MealTemplateUpdateInput,
  MealTemplateResponseDto: MealTemplate,

  // Daily Menu Templates
  DailyMenuTemplateCreateRequestDto: DailyMenuTemplateCreateInput,
  DailyMenuTemplateUpdateRequestDto: DailyMenuTemplateUpdateInput,
  DailyMenuTemplateResponseDto: DailyMenuTemplate,

  // Client Menus
  ClientMenuCreateRequestDto: ClientMenuCreateInput,
  ClientMenuUpdateRequestDto: ClientMenuUpdateInput,
  ClientMenuResponseDto: ClientMenu,
};
