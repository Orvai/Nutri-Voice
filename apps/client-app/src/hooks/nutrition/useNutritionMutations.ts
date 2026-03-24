import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  logWater,
  quickAddCalories,
  reportMeal,
  setNutritionDayType
} from "@/data/mocks/repositories/nutritionMockRepository";
import { assistantKeys } from "@/queryKeys/assistantKeys";
import { homeKeys } from "@/queryKeys/homeKeys";
import { nutritionKeys } from "@/queryKeys/nutritionKeys";
import type {
  NutritionDayType,
  NutritionMeal
} from "@/types/nutrition/nutrition.ui";

export function useNutritionMutations() {
  const queryClient = useQueryClient();

  const invalidate = async (dayType?: NutritionDayType) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: nutritionKeys.root() }),
      queryClient.invalidateQueries({ queryKey: homeKeys.root() }),
      queryClient.invalidateQueries({ queryKey: assistantKeys.root() }),
      dayType
        ? queryClient.invalidateQueries({ queryKey: nutritionKeys.plan(dayType) })
        : Promise.resolve()
    ]);
  };

  const setDayTypeMutation = useMutation({
    mutationKey: nutritionKeys.actions(),
    mutationFn: setNutritionDayType,
    onSuccess: (_, variables) => {
      void invalidate(variables.dayType);
    }
  });

  const reportMealMutation = useMutation({
    mutationKey: nutritionKeys.actions(),
    mutationFn: reportMeal,
    onSuccess: (_, variables) => {
      void invalidate(variables.dayType);
    }
  });

  const waterMutation = useMutation({
    mutationKey: nutritionKeys.actions(),
    mutationFn: logWater,
    onSuccess: () => {
      void invalidate();
    }
  });

  const caloriesMutation = useMutation({
    mutationKey: nutritionKeys.actions(),
    mutationFn: quickAddCalories,
    onSuccess: () => {
      void invalidate();
    }
  });

  return {
    setDayType: setDayTypeMutation.mutateAsync,
    reportMeal: reportMealMutation.mutateAsync,
    addWater: waterMutation.mutateAsync,
    addCalories: caloriesMutation.mutateAsync,
    isSettingDayType: setDayTypeMutation.isPending,
    isReportingMeal: reportMealMutation.isPending,
    isUpdatingWater: waterMutation.isPending,
    isUpdatingCalories: caloriesMutation.isPending,
    error:
      (setDayTypeMutation.error as Error | null)?.message ??
      (reportMealMutation.error as Error | null)?.message ??
      (waterMutation.error as Error | null)?.message ??
      (caloriesMutation.error as Error | null)?.message ??
      null
  };
}

export const getDefaultMealSelection = (meal: NutritionMeal) => ({
  productId: meal.options[0]?.id ?? "",
  grams: 150
});
