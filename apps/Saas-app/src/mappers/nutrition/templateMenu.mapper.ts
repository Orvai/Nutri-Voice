// src/mappers/nutrition/templateMenu.mapper.ts

import { TemplateMenuResponseDto }
  from "@common/api/sdk/schemas/templateMenuResponseDto";

import {
  UINutritionPlan,
  UIMeal,
  UIMealOption,
  UIVitamin,
  UIFoodItem,
  UIDayType,
  UINutritionMenuTab,
} from "@/types/ui/nutrition/nutrition.types";

/* =========================================
   Public mapper
========================================= */

export function mapTemplateMenuToTab(
  dto: Pick<
    TemplateMenuResponseDto,
    "id" | "name" | "dayType" | "totalCalories"
  >
): UINutritionMenuTab {
  return {
    id: dto.id,
    label: dto.name ?? (dto.dayType === "TRAINING" ? "יום אימון" : "יום מנוחה"),
    dayType: dto.dayType as UIDayType,
    totalCalories: dto.totalCalories,
  };
}

export function mapTemplateMenu(
  dto: TemplateMenuResponseDto
): UINutritionPlan {
  return {
    id: dto.id,
    name: dto.name,
    source: "template",
    dayType: dto.dayType as UIDayType,
    totalCalories: dto.totalCalories,
    notes: dto.notes,
    vitamins: dto.vitamins.map(mapVitamin),
    meals: dto.meals.map(mapMeal),
  };
}

/* =========================================
   Internal mappers (inline DTOs)
========================================= */

function mapVitamin(
  vitamin: TemplateMenuResponseDto["vitamins"][number]
): UIVitamin {
  return {
    id: vitamin.id,
    vitaminId: vitamin.vitaminId ?? null,
    name: vitamin.name,
    description: vitamin.description,
  };
}

function mapMeal(
  meal: TemplateMenuResponseDto["meals"][number]
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
  option: TemplateMenuResponseDto["meals"][number]["options"][number]
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
  item: TemplateMenuResponseDto["meals"][number]["options"][number]["mealTemplate"]["items"][number]
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
