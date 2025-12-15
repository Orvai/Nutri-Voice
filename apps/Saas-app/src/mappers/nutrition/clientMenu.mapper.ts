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
  UINutritionMenuTab
} from "@/types/ui/nutrition/nutrition.types";

/* =========================================
   Public mapper
========================================= */


export function mapClientMenuToTab(
  dto: Pick<
  ClientMenuResponseDto,
    "id" | "name" | "type" | "totalCalories"
  >
): UINutritionMenuTab {
  const dayType = (dto.type ?? dto.type) as UIDayType;
  return {
    id: dto.id,
    label: dto.name ?? (dayType === "TRAINING" ? "יום אימון" : "יום מנוחה"),
    dayType,
    totalCalories: dto.totalCalories,
  };
}


export function mapClientMenu(
  dto: ClientMenuResponseDto
): UINutritionPlan {
  const dayType = (dto.type ?? dto.type) as UIDayType;
  return {
    id: dto.id,
    name: dto.name,
    source: "client",
    dayType,
    totalCalories: dto.totalCalories, 
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
    totalCalories: meal.totalCalories ?? null,
    selectedOptionId: meal.selectedOptionId,
    options: meal.options.map(mapMealOption),
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
    foods: mt.items.map(mapFoodItem),
  };
}

function mapFoodItem(
  item: ClientMenuResponseDto["meals"][number]["options"][number]["mealTemplate"]["items"][number]
): UIFoodItem {
  return {
    id: item.id,
    foodItemId: item.foodItem.id,
    name: item.foodItem.name,
    role: item.role,          
    grams: item.defaultGrams,
    calories: item.foodItem.caloriesPer100g ?? null,
    color: "#E5E7EB",
    notes: item.notes,
  };
}
