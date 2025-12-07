// src/utils/mapTemplateMenuToNutritionPlan.ts
import {
  UINutritionPlan,
  UIMeal,
  UIMealOption,
  UIFoodItem,
  UIVitamin,
  UIDayType,
} from "../types/ui/nutrition-ui";

type TemplateMenuDto = {
  id: string;
  coachId: string;
  name: string;
  dayType: string;
  notes: string | null;
  totalCalories: number;
  vitamins: {
    id: string;
    vitaminId: string | null;
    name: string;
    description: string | null;
  }[];
  meals: {
    id: string;
    name: string;
    selectedOptionId: string | null;
    options: {
      id: string;
      name: string | null;
      orderIndex: number;
      mealTemplate: {
        id: string;
        name: string;
        kind: string;
        items: {
          id: string;
          role: string;
          defaultGrams: number;
          defaultCalories: number | null;
          notes: string | null;
          foodItem: {
            id: string;
            name: string;
            caloriesPer100g: number | null;
          };
        }[];
      };
    }[];
  }[];
};

function normalizeDayType(dayType: string): UIDayType {
  return dayType === "TRAINING" ? "TRAINING" : "REST";
}

function getColorByRole(role: string): string {
  switch (role) {
    case "PROTEIN":
      return "#22c55e";
    case "CARB":
      return "#3b82f6";
    case "FAT":
      return "#f97316";
    case "FREE":
      return "#6b7280";
    case "HEALTH":
      return "#0ea5e9";
    case "MENTAL_HEALTH":
      return "#a855f7";
    default:
      return "#9ca3af";
  }
}

function mapVitamins(dto: TemplateMenuDto["vitamins"]): UIVitamin[] {
  return (dto ?? []).map((v) => ({
    id: v.id,
    vitaminId: v.vitaminId,
    name: v.name,
    description: v.description,
  }));
}

function mapFoods(
  items: TemplateMenuDto["meals"][number]["options"][number]["mealTemplate"]["items"]
): UIFoodItem[] {
  return (items ?? []).map((item) => {
    let calories: number | null = item.defaultCalories;

    if (calories == null && item.foodItem.caloriesPer100g != null) {
      calories = Math.round(
        (item.defaultGrams * item.foodItem.caloriesPer100g) / 100
      );
    }

    return {
      id: item.id,
      foodItemId: item.foodItem.id,
      name: item.foodItem.name,
      role: item.role,
      grams: item.defaultGrams,
      calories,
      color: getColorByRole(item.role),
      notes: item.notes,
    };
  });
}
function mapMeals(dto: TemplateMenuDto["meals"]): UIMeal[] {
  return (dto ?? []).map((meal) => {
    const selectedId = meal.selectedOptionId;

    const realOptions = meal.options ?? [];
    let optionsToMap = realOptions;

    if (realOptions.length === 1) {
      const single = realOptions[0];
      optionsToMap = [
        {
          ...single,
          id: "default",
          name: meal.name,
          orderIndex: 0
        },
      ];
    }

    const options: UIMealOption[] = optionsToMap
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((opt) => {
        const foods = mapFoods(opt.mealTemplate.items);
        const totalCalories =
          foods.length && foods.every((f) => f.calories != null)
            ? foods.reduce((sum, f) => sum + (f.calories || 0), 0)
            : null;

        return {
          id: opt.id,
          title: opt.name ?? opt.mealTemplate.name,
          orderIndex: opt.orderIndex,
          isSelected: opt.id === selectedId,
          mealTemplateId: opt.mealTemplate.id,
          mealTemplateName: opt.mealTemplate.name,
          mealTemplateKind: opt.mealTemplate.kind,
          foods,
          totalCalories,
        };
      });

    return {
      id: meal.id,
      title: meal.name,
      timeRange: null,
      notes: null,
      options,
      selectedOptionId: selectedId,
    };
  });
}


export function mapTemplateMenuToNutritionPlan(
  templateMenu: TemplateMenuDto
): UINutritionPlan {
  if (!templateMenu) {
    throw new Error("Cannot map undefined templateMenu"); 
  }
  return {
    id: templateMenu.id,
    name: templateMenu.name,
    source: "template",
    dayType: normalizeDayType(templateMenu.dayType),
    totalCalories: templateMenu.totalCalories,
    notes: templateMenu.notes,
    vitamins: mapVitamins(templateMenu.vitamins),
    meals: mapMeals(templateMenu.meals),
  };
}
