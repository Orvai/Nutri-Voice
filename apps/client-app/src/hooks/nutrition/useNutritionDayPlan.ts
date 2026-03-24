import { useQuery } from "@tanstack/react-query";
import { getNutritionPlan } from "@/data/mocks/repositories/nutritionMockRepository";
import { mapNutritionPlanToUI } from "@/mappers/nutrition/nutrition.mapper";
import { nutritionKeys } from "@/queryKeys/nutritionKeys";
import type { NutritionDayType } from "@/types/nutrition/nutrition.ui";

export function useNutritionDayPlan(dayType: NutritionDayType) {
  const query = useQuery({
    queryKey: nutritionKeys.plan(dayType),
    queryFn: () => getNutritionPlan(dayType),
    select: mapNutritionPlanToUI
  });

  return {
    plan: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch
  };
}
