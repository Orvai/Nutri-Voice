import { NutritionPlan, Meal, MealOption, Supplement } from "../types/nutrition";
import { TemplateMenu } from "../hooks/useTemplateMenus";

export function mapTemplateMenuToNutritionPlan(menu: TemplateMenu): NutritionPlan {
  const meals = Array.isArray(menu.meals) ? menu.meals : [];
  const vitamins = Array.isArray(menu.vitamins) ? menu.vitamins : [];

  return {
    id: menu.id,
    dayType: menu.dayType === "TRAINING" ? "training" : "rest",
    totalCalories: menu.totalCalories ?? 0,
    notes: menu.notes ?? "",

    supplements: vitamins.map((v): Supplement => ({
      id: v.id,
      name: v.name,
      dosage: "",
      timing: v.description ?? "",
    })),

    meals: meals.map((m, index): Meal => {
      const options = Array.isArray(m.options) ? m.options : [];

      return {
        id: m.id,
        title: m.name || `ארוחה ${index + 1}`,
        timeRange: "",
        notes: "",
        options: options.map((opt, optIndex): MealOption => ({
          id: opt.id,
          title: opt.name || `אופציה ${optIndex + 1}`,
          color: "#2563eb",
          foods: [],
        })),
      };
    }),
  };
}
