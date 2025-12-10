import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createClientMenuFromTemplate,
  fetchClientMenus,
  fetchClientMenu,
  updateClientMenu,
} from "../../api/nutrition-api/clientMenu.api";

export function useClientMenus(clientId?: string) {
  return useQuery({
    queryKey: ["clientMenus", clientId],
    queryFn: () => fetchClientMenus(clientId)
  });
}

export function useClientMenu(id?: string | null) {
  return useQuery({
    queryKey: ["clientMenu", id],
    enabled: !!id,
    queryFn: () => fetchClientMenu(id as string)
  });
}

export function useUpdateClientMenu(menuId: string) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: (payload) => updateClientMenu(menuId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientMenu"],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["clientMenus"],
        exact: false,
      });
    },
  });
}

export function useCreateClientMenuFromTemplate(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateMenuId, name, selectedOptions }: {
      templateMenuId: string;
      name?: string;
      selectedOptions?: Array<{ templateMealId: string; optionId: string }>;
    }) =>
      createClientMenuFromTemplate({
        clientId,
        templateMenuId,
        name,
        selectedOptions,
      }),    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clientMenus"] });

      if (data?.id) {
        queryClient.setQueryData(["clientMenu", data.id], data);
      }
    },
  });
}