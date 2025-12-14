// src/mappers/nutrition/clientMenu.mapper.ts

import { ClientMenuResponseDto }
  from "@common/api/sdk/schemas/clientMenuResponseDto";

import {
  UINutritionPlan,
  UIMeal,
  UIMealOption,
  UIVitamin,
  UIFoodItem,
  UIDayType,
} from "@/types/ui/nutrition/nutrition.types";

/* =========================================
   Public mapper
========================================= */

export function mapClientMenu(
  dto: ClientMenuResponseDto
): UINutritionPlan {
  return {
    id: dto.id,
    name: dto.name,
    source: "client",
    dayType: dto.type as UIDayType,
    totalCalories: 0, // ← not provided by API
    notes: dto.notes,
    vitamins: dto.vitamins.map(mapVitamin),
    meals: dto.meals.map(mapMeal),
  };
}

/* =========================================
   Internal mappers
========================================= */

function mapVitamin(
  vitamin: ClientMenuResponseDto["vitamins"][number]
): UIVitamin {
  return {
    id: vitamin.id,
    vitaminId: vitamin.vitaminId ?? null,
    name: vitamin.name,
    description: vitamin.description,
  };
}

function mapMeal(
  meal: ClientMenuResponseDto["meals"][number]
): UIMeal {
  return {
    id: meal.id,
    title: meal.name,
    timeRange: null,
    notes: null,
    totalCalories: null, // ← not in API
    selectedOptionId: meal.selectedOptionId,
    options: meal.options.map(mapMealOption),
    foods: meal.items.map(mapFoodItem),
  };
}

function mapMealOption(
  option: ClientMenuResponseDto["meals"][number]["options"][number]
): UIMealOption {
  const mt = option.mealTemplate;

  return {
    id: option.id,
    title: option.name ?? mt.name,
    orderIndex: option.orderIndex,
    isSelected: false,
    mealTemplateId: mt.id,
    mealTemplateName: mt.name,
    mealTemplateKind: mt.kind,
    foods: [],
    totalCalories: null, // ← not in API
  };
}

function mapFoodItem(
  item: ClientMenuResponseDto["meals"][number]["items"][number]
): UIFoodItem {
  return {
    id: item.id,
    foodItemId: item.foodItem.id,
    name: item.foodItem.name,
    role: "FREE",          // ← not provided by API
    grams: item.quantity,
    calories: item.calories ?? null,
    color: "#E5E7EB",
    notes: item.notes,
  };
}
