export type FoodItem = {
  id: string;
  name: string;
  grams: number;
  calories: number;
  color: string;
};

export type MealOption = {
  id: string;
  title: string;
  color: string;
  foods: FoodItem[];
};

export type Meal = {
  id: string;
  title: string;
  timeRange: string;
  notes: string;
  options: MealOption[];
};

export type Supplement = {
  id: string;
  name: string;
  dosage: string;
  timing: string;
};

export type NutritionPlan = {
  id: string;
  dayType: "training" | "rest";
  totalCalories: number;
  notes: string;
  supplements: Supplement[];
  meals: Meal[];
};
