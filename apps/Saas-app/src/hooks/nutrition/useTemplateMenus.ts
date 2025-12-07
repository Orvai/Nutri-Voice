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
    queryFn: () => {
      console.log("🔄 FETCHING TEMPLATE MENU", id);
      return fetchTemplateMenu(id as string);
    },
  });
}
