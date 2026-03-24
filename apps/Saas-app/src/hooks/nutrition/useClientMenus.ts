// src/hooks/nutrition/useClientMenus.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {getApiClientMenusId,putApiClientMenusId,getApiClientMenus,postApiClientMenusFromTemplate,} from "@common/api/sdk/nutri-api";
import {ClientMenuUpdateRequestDto,ClientMenuCreateFromTemplateRequestDto,} from "@common/api/sdk/schemas";
import { nutritionKeys } from "@/queryKeys/nutritionKeys";
import {mapClientMenu,mapClientMenuToTab,} from "@/mappers/nutrition/clientMenu.mapper";
import {
  UINutritionPlan,
  UINutritionMenuTab,
} from "@/types/ui/nutrition/nutrition.types";

type ClientMenuTabDto = {
  id: string;
  name: string;
  type: string;
  totalCalories: number;
  allowedDaysPerWeek?: number;
};

function isClientMenuTabDto(value: unknown): value is ClientMenuTabDto {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const dto = value as Record<string, unknown>;
  return (
    typeof dto.id === "string" &&
    typeof dto.name === "string" &&
    typeof dto.type === "string" &&
    typeof dto.totalCalories === "number" &&
    (dto.allowedDaysPerWeek === undefined ||
      typeof dto.allowedDaysPerWeek === "number")
  );
}

/* =====================================
   Queries
===================================== */

export function useClientMenus(clientId?: string) {
  return useQuery<UINutritionMenuTab[]>({
    queryKey: nutritionKeys.clientMenus(clientId),
    enabled: !!clientId, 
    queryFn: async ({ signal }) => {
      const res = (await getApiClientMenus(
        { clientId: clientId! },
        signal
      )) as unknown[];

      const normalizedMenus = res.flatMap((menu) =>
        Array.isArray(menu) ? menu : [menu]
      );

      return normalizedMenus.filter(isClientMenuTabDto).map(mapClientMenuToTab);
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
        queryKey: [...nutritionKeys.root, "clientMenus"],
      });
    },
  });
}

export function useCreateClientMenuFromTemplate(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<ClientMenuCreateFromTemplateRequestDto, 'clientId'>) => {
      return postApiClientMenusFromTemplate({
        ...data,
        clientId: clientId 
      }); 
    },
    
    onSuccess: (_data) => {
      queryClient.invalidateQueries({  
        queryKey: nutritionKeys.clientMenus(clientId),
      });
    },

    onError: (error) => {
      console.error("❌ MUTATION ERROR", error);
    },
  });
}
