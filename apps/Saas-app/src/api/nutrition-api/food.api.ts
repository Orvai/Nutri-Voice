import { api } from "../api";
import { FoodItem } from "../../types/nutrition-types/food.types";

export async function fetchFood(search?: string) {
  const res = await api.get<{ data: FoodItem[] }>("/food", {
    params: search ? { search } : undefined
  });
  return res.data.data;
}
