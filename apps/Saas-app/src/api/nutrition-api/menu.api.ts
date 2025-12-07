import { api } from "../api";
import { MealTemplate } from "../../types/nutrition-types/mealTemplate.types";
import { TemplateMenu } from "../../types/nutrition-types/templateMenu.types";
import { TemplateMenuVitamin } from "../../types/nutrition-types/templateMenu.types";


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
  console.log("id:",id);
  const res = await api.get<{ data: TemplateMenu }>(`/template-menus/${id}`);
  console.log("response",res.data.data);
  return res.data.data;
}

export async function updateTemplateMenu(id: string, payload: any) {
  const res = await api.put<{ data: TemplateMenu }>(`/template-menus/${id}`,payload);
  return res.data.data;
}

export async function fetchVitamins() {
  const res = await api.get<{ data: TemplateMenuVitamin[] }>("/vitamins");
  return res.data.data;
}


