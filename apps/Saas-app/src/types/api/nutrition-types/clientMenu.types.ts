import { FoodItem } from "./food.types";
import { MealTemplate } from "./mealTemplate.types";

export interface ClientMenuItem {
  id: string;
  foodItemId: string;
  quantity: number;
  calories: number;
  notes: string | null;
  foodItem: FoodItem;
}

export interface ClientMenuMealOption {
  id: string;
  name: string | null;
  orderIndex: number;
  mealTemplate: MealTemplate;
}

export interface ClientMenuMeal {
  id: string;
  name: string;
  totalCalories: number;
  selectedOptionId: string | null;
  items: ClientMenuItem[];
  options: ClientMenuMealOption[];
}

export interface ClientMenuVitamin {
  id: string;
  vitaminId: string | null;
  name: string;
  description: string | null;
}

export interface ClientMenu {
  id: string;
  name: string;
  type: "TRAINING" | "REST";
  notes: string | null;
  isActive: boolean;
  totalCalories: number;
  meals: ClientMenuMeal[];
  vitamins: ClientMenuVitamin[];
}
