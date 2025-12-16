import { ClientMenuResponseDto } from "@common/api/sdk/schemas/clientMenuResponseDto";
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
   Tabs (list)
========================================= */
export function mapClientMenuToTab(
  dto: Pick<ClientMenuResponseDto, "id" | "name" | "type" | "totalCalories">
): UINutritionMenuTab {
  const dayType = dto.type as UIDayType;

  return {
    id: dto.id,
    label: dto.name,
    dayType,
    totalCalories: dto.totalCalories,
  };
}

/* =========================================
   Full menu
========================================= */
export function mapClientMenu(
  dto: ClientMenuResponseDto
): UINutritionPlan {
  const dayType = dto.type as UIDayType;

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
    notes: meal.notes,
    totalCalories: meal.totalCalories,
    selectedOptionId: meal.selectedOptionId ?? null,
    options: meal.options.map((option) =>
      mapMealOption(option, meal.selectedOptionId)
    ),
  };
}

function mapMealOption(
  option: ClientMenuResponseDto["meals"][number]["options"][number],
  selectedOptionId: string | null
): UIMealOption {
  return {
    id: option.id,
    title: option.name ?? "",
    orderIndex: option.orderIndex,
    isSelected: option.id === selectedOptionId,
    foods: option.items.map(mapFoodItem),
  };
}

function mapFoodItem(
  item: ClientMenuResponseDto["meals"][number]["options"][number]["items"][number]
): UIFoodItem {
  return {
    id: item.id,
    foodItemId: item.foodItem.id,
    name: item.foodItem.name,
    role: item.role,
    grams: item.grams,
    caloriesPer100g: item.foodItem.caloriesPer100g ?? null,
    color: "#E5E7EB",
  };
}
