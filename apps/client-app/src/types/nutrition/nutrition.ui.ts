export type NutritionDayType = "training" | "rest";

export type NutritionMacroSummary = {
  protein: { consumed: number; target: number };
  carbs: { consumed: number; target: number };
  fat: { consumed: number; target: number };
};

export type NutritionProduct = {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
};

export type LoggedMeal = {
  productId: string;
  grams: number;
  loggedAtLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NutritionMeal = {
  id: string;
  name: string;
  icon: string;
  targetCalories: number;
  options: NutritionProduct[];
  logged: LoggedMeal | null;
};

export type NutritionDayPlan = {
  dayType: NutritionDayType;
  title: string;
  calorieTarget: number;
  consumedCalories: number;
  remainingCalories: number;
  caloriesProgress: number;
  waterMl: number;
  macros: NutritionMacroSummary;
  meals: NutritionMeal[];
};
