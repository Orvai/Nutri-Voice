import { useQuery } from "@tanstack/react-query";
import { fetchTemplateMenus, fetchTemplateMenu } from "../../api/nutrition-api/menu.api";

export function useTemplateMenus() {
  return useQuery({
    queryKey: ["templateMenus"],
    queryFn: fetchTemplateMenus
  });
}

export function useTemplateMenu(id?: string | null) {
  return useQuery({
    queryKey: ["templateMenu", id],
    enabled: !!id, 
    queryFn: () => fetchTemplateMenu(id as string),
  });
}
