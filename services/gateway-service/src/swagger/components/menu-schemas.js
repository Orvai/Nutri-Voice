// gateway/src/swagger/components/menu.schemas.js
import {
    FoodCreateDto,
    FoodUpdateDto,
    FoodListQueryDto,
    FoodSearchQueryDto,
  } from "../../dtos/menu/food.dto.js";
  
  import {
    MealTemplateCreateDto,
    MealTemplateUpsertDto,
    MealTemplateListQueryDto,
  } from "../../dtos/menu/mealTemplate.dto.js";
  
  import {
    TemplateMenuCreateDto,
    TemplateMenuUpdateDto,
    TemplateMenuListQueryDto,
  } from "../../dtos/menu/templateMenu.dto.js";
  
  import {
    ClientMenuCreateDto,
    ClientMenuUpdateDto,
    ClientMenuFromTemplateDto,
    ClientMenuListQueryDto,
  } from "../../dtos/menu/clientMenu.dto.js";
  
  import { zodToJsonSchema } from "zod-to-json-schema";
  
  export const menuSchemas = {
    // FOOD
    FoodCreateDto: zodToJsonSchema(FoodCreateDto, "FoodCreateDto"),
    FoodUpdateDto: zodToJsonSchema(FoodUpdateDto, "FoodUpdateDto"),
    FoodListQueryDto: zodToJsonSchema(FoodListQueryDto, "FoodListQueryDto"),
    FoodSearchQueryDto: zodToJsonSchema(FoodSearchQueryDto, "FoodSearchQueryDto"),
  
    // MEAL TEMPLATE
    MealTemplateCreateDto: zodToJsonSchema(MealTemplateCreateDto, "MealTemplateCreateDto"),
    MealTemplateUpsertDto: zodToJsonSchema(MealTemplateUpsertDto, "MealTemplateUpsertDto"),
    MealTemplateListQueryDto: zodToJsonSchema(MealTemplateListQueryDto, "MealTemplateListQueryDto"),
  
    // TEMPLATE MENU
    TemplateMenuCreateDto: zodToJsonSchema(TemplateMenuCreateDto, "TemplateMenuCreateDto"),
    TemplateMenuUpdateDto: zodToJsonSchema(TemplateMenuUpdateDto, "TemplateMenuUpdateDto"),
    TemplateMenuListQueryDto: zodToJsonSchema(TemplateMenuListQueryDto, "TemplateMenuListQueryDto"),
  
    // CLIENT MENU
    ClientMenuCreateDto: zodToJsonSchema(ClientMenuCreateDto, "ClientMenuCreateDto"),
    ClientMenuUpdateDto: zodToJsonSchema(ClientMenuUpdateDto, "ClientMenuUpdateDto"),
    ClientMenuFromTemplateDto: zodToJsonSchema(ClientMenuFromTemplateDto, "ClientMenuFromTemplateDto"),
    ClientMenuListQueryDto: zodToJsonSchema(ClientMenuListQueryDto, "ClientMenuListQueryDto"),
  };
  