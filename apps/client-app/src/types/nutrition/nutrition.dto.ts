export type NutritionDayTypeDto = "training" | "rest";

export type NutritionProductDto = {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
};

export type LoggedMealDto = {
  productId: string;
  grams: number;
  loggedAtIso: string;
};

export type NutritionMealDto = {
  id: string;
  name: string;
  icon: string;
  targetCalories: number;
  options: NutritionProductDto[];
  logged: LoggedMealDto | null;
};

export type NutritionPlanDto = {
  dayType: NutritionDayTypeDto;
  title: string;
  calorieTarget: number;
  manualCalories: number;
  waterMl: number;
  meals: NutritionMealDto[];
};

export type ReportMealInputDto = {
  dayType: NutritionDayTypeDto;
  mealId: string;
  productId: string;
  grams: number;
};

export type SetDayTypeInputDto = {
  dayType: NutritionDayTypeDto;
};
