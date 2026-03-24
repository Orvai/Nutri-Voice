import type {
  NutritionMealDto,
  NutritionPlanDto,
  NutritionProductDto
} from "@/types/nutrition/nutrition.dto";

export const findProduct = (
  meal: NutritionMealDto,
  productId: string
): NutritionProductDto | null => {
  return meal.options.find((option) => option.id === productId) ?? null;
};

export const mealTotals = (meal: NutritionMealDto): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
} => {
  if (!meal.logged) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  const product = findProduct(meal, meal.logged.productId);
  if (!product) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  const ratio = meal.logged.grams / 100;

  return {
    calories: Math.round(product.caloriesPer100g * ratio),
    protein: Math.round(product.proteinPer100g * ratio),
    carbs: Math.round(product.carbsPer100g * ratio),
    fat: Math.round(product.fatPer100g * ratio)
  };
};

export const nutritionTotals = (plan: NutritionPlanDto) => {
  const macroTotals = plan.meals.reduce(
    (acc, meal) => {
      const totals = mealTotals(meal);
      return {
        calories: acc.calories + totals.calories,
        protein: acc.protein + totals.protein,
        carbs: acc.carbs + totals.carbs,
        fat: acc.fat + totals.fat
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    calories: macroTotals.calories + plan.manualCalories,
    protein: macroTotals.protein,
    carbs: macroTotals.carbs,
    fat: macroTotals.fat
  };
};
