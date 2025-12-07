import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMealTemplate } from "../../api/nutrition-api/mealTemplate.api";

export function useUpdateMealTemplate(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => updateMealTemplate(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealTemplate", id] });
      queryClient.invalidateQueries({
        queryKey: ["templateMenu"],
        exact: false,
      });    },
  });
}
