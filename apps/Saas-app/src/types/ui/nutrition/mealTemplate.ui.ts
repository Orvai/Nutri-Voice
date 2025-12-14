// src/types/ui/nutrition/mealTemplate.ui.ts
export type MealTemplate = {
    id: string;
    name: string;
    kind: string;
    totalCalories: number;
    items: MealTemplateItem[];
  };
  
  export type MealTemplateItem = {
    id: string;
    foodItemId: string;
    role: string;
    defaultGrams: number;
    defaultCalories?: number;
    notes?: string;
    food: {
      id: string;
      name: string;
      caloriesPer100g?: number;
      proteinPer100g?: number;
    };
  };
  