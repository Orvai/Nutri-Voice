import { api } from "../api";
import { MealTemplate } from "../../types/api/nutrition-types/mealTemplate.types";

export async function updateMealTemplate(id: string, payload: any) {
  const res = await api.put<{ data: MealTemplate }>(`/templates/${id}`, payload);
  return res.data.data;
}
