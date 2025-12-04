import { FoodItem } from "./food.types";

export interface MealTemplateItem {
  id: string;
  foodItemId: string;
  role: string;
  defaultGrams: number;
  defaultCalories: number | null;
  notes: string | null;
  foodItem: FoodItem;
}

export interface MealTemplate {
  id: string;
  name: string;
  kind: string;
  totalCalories: number;
  coachId: string;
  items: MealTemplateItem[];
}
