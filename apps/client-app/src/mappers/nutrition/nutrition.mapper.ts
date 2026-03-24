import type { NutritionMealDto, NutritionPlanDto, NutritionProductDto } from "@/types/nutrition/nutrition.dto";
import type { LoggedMeal, NutritionDayPlan, NutritionMeal, NutritionProduct } from "@/types/nutrition/nutrition.ui";
import { clampPercent, formatTime } from "@/utils/format";

const mapProduct = (dto: NutritionProductDto): NutritionProduct => ({
  id: dto.id,
  name: dto.name,
  caloriesPer100g: dto.caloriesPer100g,
  proteinPer100g: dto.proteinPer100g,
  carbsPer100g: dto.carbsPer100g,
  fatPer100g: dto.fatPer100g
});

const macrosFromMeal = (
  meal: NutritionMealDto,
  products: NutritionProduct[]
): LoggedMeal | null => {
  if (!meal.logged) {
    return null;
  }

  const product = products.find((item) => item.id === meal.logged?.productId);
  if (!product) {
    return null;
  }

  const ratio = meal.logged.grams / 100;
  const calories = Math.round(product.caloriesPer100g * ratio);
  const protein = Math.round(product.proteinPer100g * ratio);
  const carbs = Math.round(product.carbsPer100g * ratio);
  const fat = Math.round(product.fatPer100g * ratio);

  return {
    productId: product.id,
    grams: meal.logged.grams,
    loggedAtLabel: formatTime(meal.logged.loggedAtIso),
    calories,
    protein,
    carbs,
    fat
  };
};

const mapMeal = (meal: NutritionMealDto): NutritionMeal => {
  const options = meal.options.map(mapProduct);
  const logged = macrosFromMeal(meal, options);

  return {
    id: meal.id,
    name: meal.name,
    icon: meal.icon,
    targetCalories: meal.targetCalories,
    options,
    logged
  };
};

export const mapNutritionPlanToUI = (dto: NutritionPlanDto): NutritionDayPlan => {
  const meals = dto.meals.map(mapMeal);

  const consumedFromMeals = meals.reduce(
    (acc, meal) => {
      if (!meal.logged) {
        return acc;
      }

      return {
        calories: acc.calories + meal.logged.calories,
        protein: acc.protein + meal.logged.protein,
        carbs: acc.carbs + meal.logged.carbs,
        fat: acc.fat + meal.logged.fat
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const consumedCalories = consumedFromMeals.calories + dto.manualCalories;

  const targets =
    dto.dayType === "training"
      ? { protein: 180, carbs: 280, fat: 75 }
      : { protein: 170, carbs: 200, fat: 85 };

  return {
    dayType: dto.dayType,
    title: dto.title,
    calorieTarget: dto.calorieTarget,
    consumedCalories,
    remainingCalories: Math.max(0, dto.calorieTarget - consumedCalories),
    caloriesProgress: clampPercent(consumedCalories / dto.calorieTarget),
    waterMl: dto.waterMl,
    macros: {
      protein: {
        consumed: consumedFromMeals.protein,
        target: targets.protein
      },
      carbs: {
        consumed: consumedFromMeals.carbs,
        target: targets.carbs
      },
      fat: {
        consumed: consumedFromMeals.fat,
        target: targets.fat
      }
    },
    meals
  };
};
