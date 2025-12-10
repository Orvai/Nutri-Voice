import { useUpdateTemplateMenu } from "./useUpdateTemplateMenu";
import { useUpdateMealTemplate } from "./useUpdateMealTemplate";
import { useUpdateClientMenu } from "./useClientMenus";
import { UINutritionSource } from "../../types/ui/nutrition-ui";

export function useNutritionMenuMutation(menuId: string, source: UINutritionSource) {
  return source === "client" ? useUpdateClientMenu(menuId) : useUpdateTemplateMenu(menuId);
}

export function useNutritionMealTemplateMutation(
  mealTemplateId: string,
  menuId: string,
  source: UINutritionSource
) {
  return source === "client"
    ? useUpdateClientMenu(menuId)
    : useUpdateMealTemplate(mealTemplateId);
}

export function getMenuQueryKey(source: UINutritionSource, menuId?: string | null) {
  const base = source === "client" ? "clientMenu" : "templateMenu";
  return menuId ? [base, menuId] : [base];
}