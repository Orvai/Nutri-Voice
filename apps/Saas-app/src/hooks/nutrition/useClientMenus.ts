// src/hooks/nutrition/useClientMenus.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getApiClientMenusId,
  putApiClientMenusId,
  postApiClientMenusFromTemplate,
} from "@common/api/sdk/nutri-api";
import { customFetcher } from "@common/api/sdk/fetcher";
import { ClientMenuResponseDto } from "@common/api/sdk/schemas/clientMenuResponseDto";
import {
  ClientMenuUpdateRequestDto,
  ClientMenuCreateFromTemplateRequestDto,
} from "@common/api/sdk/schemas";
import { nutritionKeys } from "@/queryKeys/nutritionKeys";
import {
  mapClientMenu,
  mapClientMenuToTab,
} from "@/mappers/nutrition/clientMenu.mapper";
import {
  UINutritionPlan,
  UINutritionMenuTab,
} from "@/types/ui/nutrition/nutrition.types";

/* =====================================
   Queries
===================================== */

export function useClientMenus(clientId?: string) {
  return useQuery<UINutritionMenuTab[]>({
    queryKey: nutritionKeys.clientMenus(clientId),
    enabled: !!clientId,
    queryFn: async ({ signal }) => {
      const res = await customFetcher<ClientMenuResponseDto[]>({
        url: "/api/client-menus",
        method: "GET",
        params: { clientId },
        signal,
      });

      return res.map(mapClientMenuToTab);
    },
  });
}

export function useClientMenu(id?: string | null) {
  return useQuery<UINutritionPlan>({
    queryKey: id ? nutritionKeys.clientMenu(id) : [],
    enabled: !!id,
    queryFn: async ({ signal }) => {
      const res = await getApiClientMenusId(id as string, signal);
      return mapClientMenu(res);
    },
  });
}

/* =====================================
   Mutations
===================================== */

export function useUpdateClientMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ClientMenuUpdateRequestDto;
    }) => putApiClientMenusId(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: nutritionKeys.clientMenu(id),
      });
      queryClient.invalidateQueries({
        queryKey: nutritionKeys.clientMenus(),
      });
    },
  });
}

export function useCreateClientMenuFromTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClientMenuCreateFromTemplateRequestDto) => {
      console.log("🔥 MUTATION FN DATA:", data);
      return postApiClientMenusFromTemplate(data);
    },

    onSuccess: (_data, variables) => {
      console.log("✅ MUTATION SUCCESS", variables);

      if (!variables?.clientId) return;

      queryClient.invalidateQueries({
        queryKey: nutritionKeys.clientMenus(variables.clientId),
      });
    },

    onError: (error) => {
      console.error("❌ MUTATION ERROR", error);
    },
  });
}
