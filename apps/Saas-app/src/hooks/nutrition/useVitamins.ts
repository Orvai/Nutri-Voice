import { useQuery } from "@tanstack/react-query";
import { fetchVitamins } from "../../api/nutrition-api/menu.api";

export function useVitamins() {
  return useQuery({
    queryKey: ["vitamins"],
    queryFn: fetchVitamins,
  });
}
