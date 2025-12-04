import { api } from "../api";
import { MealTemplate } from "../../types/nutrition-types/mealTemplate.types";
import { TemplateMenu } from "../../types/nutrition-types/templateMenu.types";

export async function fetchMealTemplates() {
  const res = await api.get<{ data: MealTemplate[] }>("/templates");
  return res.data.data;
}

export async function fetchMealTemplate(id: string) {
  const res = await api.get<{ data: MealTemplate }>(`/templates/${id}`);
  return res.data.data;
}

export async function fetchTemplateMenus() {
  const res = await api.get<{ data: TemplateMenu[] }>("/template-menus");
  return res.data.data;
}

export async function fetchTemplateMenu(id: string) {
  const res = await api.get<{ data: TemplateMenu }>(`/template-menus/${id}`);
  return res.data.data;
}
