// src/types/nutrition-ui.ts

export type UINutritionSource = "template" | "client";

export type UIDayType = "TRAINING" | "REST";

export type UIMealTemplateKind =
  | "MEAT_MEAL"
  | "DAIRY_MEAL"
  | "CARB_LOAD"
  | "FREE_CALORIES"
  | "OTHER"
  | string;

export type UIFoodRole =
  | "PROTEIN"
  | "CARB"
  | "FAT"
  | "FREE"
  | "HEALTH"
  | "MENTAL_HEALTH"
  | string;

export interface UINutritionPlan {
  id: string;
  name: string;
  source: UINutritionSource;
  dayType: UIDayType;
  totalCalories: number;
  notes: string | null;
  vitamins: UIVitamin[];
  meals: UIMeal[];
}

export interface UIVitamin {
  id: string;
  vitaminId?: string | null;
  name: string;
  description: string | null;
}

export interface UIMeal {
  id: string;
  title: string;
  timeRange: string | null;
  notes: string | null;
  totalCalories: number | null;
  options: UIMealOption[];
  selectedOptionId: string | null;
  foods?: UIFoodItem[];
  meals?: undefined;
  mealTemplateId?: string;
}

export interface UIMealOption {
  id: string;
  title: string;
  orderIndex: number;
  isSelected: boolean;
  mealTemplateId: string;
  mealTemplateName: string;
  mealTemplateKind: UIMealTemplateKind;
  foods: UIFoodItem[];
  totalCalories: number | null;
}

export interface UIFoodItem {
  id: string;
  foodItemId: string;
  name: string;
  role: UIFoodRole;
  grams: number;
  calories: number | null;
  color: string;
  notes: string | null;
}
