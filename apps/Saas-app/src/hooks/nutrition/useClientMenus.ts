import { useQuery } from "@tanstack/react-query";
import { fetchClientMenus, fetchClientMenu } from "../../api/nutrition-api/clientMenu.api";

export function useClientMenus(clientId?: string) {
  return useQuery({
    queryKey: ["clientMenus", clientId],
    queryFn: () => fetchClientMenus(clientId)
  });
}

export function useClientMenu(id: string) {
  return useQuery({
    queryKey: ["clientMenu", id],
    queryFn: () => fetchClientMenu(id)
  });
}
