// src/hooks/nutrition/useTemplateMenus.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {getApiTemplateMenus,getApiTemplateMenusId,putApiTemplateMenusId,} from "@common/api/sdk/nutri-api";
import { TemplateMenuUpdateRequestDto } from "@common/api/sdk/schemas/templateMenuUpdateRequestDto";
import { nutritionKeys } from "@/queryKeys/nutritionKeys";
import { mapTemplateMenu,mapTemplateMenuToTab } from "@/mappers/nutrition/templateMenu.mapper";
import { UINutritionPlan,UINutritionMenuTab } from "@/types/ui/nutrition/nutrition.types";

/* =====================================
   Queries
===================================== */

export function useTemplateMenus() {
  return useQuery<UINutritionMenuTab[]>({
    queryKey: nutritionKeys.templateMenus(),
    queryFn: async ({ signal }) => {
      const res = await getApiTemplateMenus(signal);
      return res.map(mapTemplateMenuToTab);
    },
  });
}

export function useTemplateMenu(id?: string | null) {
  return useQuery<UINutritionPlan>({
    queryKey: id ? nutritionKeys.templateMenu(id) : [],
    enabled: !!id,
    queryFn: async ({ signal }) => {
      const res = await getApiTemplateMenusId(id as string, signal);
      return mapTemplateMenu(res);
    },
  });
}


/* =====================================
   Mutations
===================================== */

export function useUpdateTemplateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TemplateMenuUpdateRequestDto;
    }) => putApiTemplateMenusId(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: nutritionKeys.templateMenu(id),
      });

      queryClient.invalidateQueries({
        queryKey: nutritionKeys.templateMenus(),
      });
    },
  });
}
