import { useQuery } from "@tanstack/react-query";
import { fetchMealTemplates, fetchMealTemplate } from "../../api/nutrition-api/menu.api";

export function useMealTemplates() {
  return useQuery({
    queryKey: ["mealTemplates"],
    queryFn: fetchMealTemplates
  });
}

export function useMealTemplate(id: string) {
  return useQuery({
    queryKey: ["mealTemplate", id],
    queryFn: () => fetchMealTemplate(id)
  });
}
