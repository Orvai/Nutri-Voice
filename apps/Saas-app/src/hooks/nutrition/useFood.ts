// src/hooks/nutrition/useFood.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {getApiFood,postApiFood,putApiFoodId,deleteApiFoodId,} from "@common/api/sdk/nutri-api";
import {FoodItemRequestCreateDto,FoodItemRequestUpdateDto,} from "@common/api/sdk/schemas";
import { nutritionKeys } from "@/queryKeys/nutritionKeys";
import { mapFood } from "@/mappers/nutrition/food.mapper";
import { Food } from "@/types/ui/nutrition/food.ui";

/* =========================================
   Queries
========================================= */

export function useFood(search?: string) {
  return useQuery<Food[]>({
    queryKey: nutritionKeys.food(search),
    queryFn: async ({ signal }) => {
      const res = await getApiFood(signal);
      return res.data.map(mapFood);
    },
  });
}

/* =========================================
   Mutations
========================================= */

export function useCreateFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FoodItemRequestCreateDto) =>
      postApiFood(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: nutritionKeys.root,
      });
    },
  });
}

export function useUpdateFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FoodItemRequestUpdateDto;
    }) => putApiFoodId(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: nutritionKeys.food(),
      });
    },
  });
}

export function useDeleteFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApiFoodId(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: nutritionKeys.food(),
      });
    },
  });
}
