import { useQuery } from "@tanstack/react-query";
import { fetchFood } from "../../api/nutrition-api/food.api";

export function useFood(search?: string) {
  return useQuery({
    queryKey: ["food", search],
    queryFn: () => fetchFood(search)
  });
}
