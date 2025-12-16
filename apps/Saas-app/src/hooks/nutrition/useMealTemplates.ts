// src/hooks/nutrition/useMealTemplates.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getApiMealTemplates,
  getApiMealTemplatesId,
  postApiMealTemplates,
  putApiMealTemplatesId,
  deleteApiMealTemplatesId,
} from "@common/api/sdk/nutri-api";

import {
  MealTemplateCreateRequestDto,
  MealTemplateUpdateRequestDto,
} from "@common/api/sdk/schemas";

import { nutritionKeys } from "@/queryKeys/nutritionKeys";

import {
  mapMealTemplate,
  type UIMealTemplate,
} from "@/mappers/nutrition/mealTemplate.mapper";

/* =====================================
   Queries
===================================== */

/**
 * List all meal templates (coach scope)
 */
export function useMealTemplates() {
  return useQuery<UIMealTemplate[]>({ 
    queryKey: nutritionKeys.mealTemplates(),
    queryFn: async ({ signal }) => {
      const res = await getApiMealTemplates(signal);
      return res.data.map(mapMealTemplate);
    },
  });
}

/**
 * Get single meal template by id
 */
export function useMealTemplate(id?: string | null) {
  return useQuery<UIMealTemplate>({ 
    queryKey: id ? nutritionKeys.mealTemplate(id) : [],
    enabled: !!id,
    queryFn: async ({ signal }) => {
      const res = await getApiMealTemplatesId(id as string, signal);

      return mapMealTemplate(res.data);
    },
  });
}

/* =====================================
   Mutations (UNCHANGED – DTO only)
===================================== */

/**
 * Create meal template
 */
export function useCreateMealTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MealTemplateCreateRequestDto) =>
      postApiMealTemplates(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: nutritionKeys.mealTemplates(),
      });
    },
  });
}

/**
 * Update meal template
 */
export function useUpdateMealTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: MealTemplateUpdateRequestDto;
    }) => putApiMealTemplatesId(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: nutritionKeys.mealTemplates(),
      });
      queryClient.invalidateQueries({
        queryKey: nutritionKeys.mealTemplate(id),
      });

      queryClient.invalidateQueries({
        queryKey: nutritionKeys.templateMenus(),
      });

      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "nutrition" &&
          query.queryKey[1] === "templateMenu",
      });
    },
  });
}

/**
 * Delete meal template
 */
export function useDeleteMealTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApiMealTemplatesId(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: nutritionKeys.mealTemplates(),
      });
    },
  });
}
