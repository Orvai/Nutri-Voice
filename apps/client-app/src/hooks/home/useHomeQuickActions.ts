import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addQuickCalories,
  addQuickWater
} from "@/data/mocks/repositories/homeMockRepository";
import { assistantKeys } from "@/queryKeys/assistantKeys";
import { homeKeys } from "@/queryKeys/homeKeys";
import { nutritionKeys } from "@/queryKeys/nutritionKeys";

export function useHomeQuickActions() {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: homeKeys.root() }),
      queryClient.invalidateQueries({ queryKey: nutritionKeys.root() }),
      queryClient.invalidateQueries({ queryKey: assistantKeys.root() })
    ]);
  };

  const waterMutation = useMutation({
    mutationKey: homeKeys.quickActions(),
    mutationFn: addQuickWater,
    onSuccess: () => {
      void invalidate();
    }
  });

  const caloriesMutation = useMutation({
    mutationKey: homeKeys.quickActions(),
    mutationFn: addQuickCalories,
    onSuccess: () => {
      void invalidate();
    }
  });

  return {
    addWater: waterMutation.mutateAsync,
    addCalories: caloriesMutation.mutateAsync,
    isAddingWater: waterMutation.isPending,
    isAddingCalories: caloriesMutation.isPending,
    error:
      (waterMutation.error as Error | null)?.message ??
      (caloriesMutation.error as Error | null)?.message ??
      null
  };
}
