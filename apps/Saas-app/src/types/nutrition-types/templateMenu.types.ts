import { MealTemplate } from "./mealTemplate.types";

export interface TemplateMenuVitamin {
  id: string;
  vitaminId: string | null;
  name: string;
  description: string | null;
}

export interface TemplateMenuMealOption {
  id: string;
  name: string | null;
  orderIndex: number;
  mealTemplate: MealTemplate;
}

export interface TemplateMenuMeal {
  id: string;
  name: string;
  selectedOptionId: string | null;
  options: TemplateMenuMealOption[];
}

export interface TemplateMenu {
  id: string;
  coachId: string;
  name: string;
  dayType: "TRAINING" | "REST";
  notes: string | null;
  totalCalories: number;
  meals: TemplateMenuMeal[];
  vitamins: TemplateMenuVitamin[];
}
