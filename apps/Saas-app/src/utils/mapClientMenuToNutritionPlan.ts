import {
    UINutritionPlan,
    UIMeal,
    UIMealOption,
    UIFoodItem,
    UIVitamin,
    UIDayType,
    UIFoodRole,
  } from "../types/ui/nutrition/nutrition.types";
  import { ClientMenu } from "../types/api/nutrition-types/clientMenu.types";
  import { getColorByRole, normalizeDayType } from "./mapTemplateMenuToNutritionPlan";
  
  function categoryToRole(category?: string | null): UIFoodRole {
    switch (category) {
      case "PROTEIN":
        return "PROTEIN";
      case "CARB":
        return "CARB";
      case "FAT":
        return "FAT";
      case "HEALTH":
        return "HEALTH";
      case "MENTAL_HEALTH":
        return "MENTAL_HEALTH";
      default:
        return "FREE";
    }
  }
  
  function mapVitamins(vitamins: ClientMenu["vitamins"]): UIVitamin[] {
    return (vitamins ?? []).map((v) => ({
      id: v.id,
      vitaminId: v.vitaminId,
      name: v.name,
      description: v.description,
    }));
  }
  
  function mapClientItems(items: ClientMenu["meals"][number]["items"]): UIFoodItem[] {
    return (items ?? []).map((item) => {
      const role = categoryToRole(item.foodItem?.category);
      let calories: number | null = item.calories ?? null;
  
      if (calories == null && item.foodItem?.caloriesPer100g != null) {
        calories = Math.round((item.quantity * item.foodItem.caloriesPer100g) / 100);
      }
  
      return {
        id: item.id,
        foodItemId: item.foodItemId,
        name: item.foodItem?.name ?? "",
        role,
        grams: item.quantity,
        calories,
        color: getColorByRole(role),
        notes: item.notes,
      };
    });
  }
  
  function mapMealTemplateItems(
    items: NonNullable<ClientMenu["meals"][number]["options"]>[number]["mealTemplate"]["items"]
  ): UIFoodItem[] {
    return (items ?? []).map((item) => {
      let calories: number | null = item.defaultCalories;
  
      if (calories == null && item.foodItem.caloriesPer100g != null) {
        calories = Math.round((item.defaultGrams * item.foodItem.caloriesPer100g) / 100);
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
  
  function resolveDayType(dayType: string): UIDayType {
    return normalizeDayType(dayType);
  }
  
  function mapMeals(meals: ClientMenu["meals"]): UIMeal[] {
    return (meals ?? []).map((meal) => {
      const selectedId = meal.selectedOptionId;
      const realOptions = meal.options ?? [];
      const fallbackOptionCalories = realOptions[0]?.mealTemplate.totalCalories ?? null;
      const mealTotalCalories =
        meal.totalCalories != null ? meal.totalCalories : fallbackOptionCalories;
  
      const options: UIMealOption[] = realOptions
        .slice()
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((opt) => {
          const foods = mapMealTemplateItems(opt.mealTemplate.items);
  
          return {
            id: opt.id,
            title: opt.name ?? opt.mealTemplate.name,
            orderIndex: opt.orderIndex,
            isSelected: opt.id === selectedId,
            mealTemplateId: opt.mealTemplate.id,
            mealTemplateName: opt.mealTemplate.name,
            mealTemplateKind: opt.mealTemplate.kind,
            foods,
            totalCalories: null,
          };
        });
  
      if (realOptions.length === 1) {
        const singleOption = realOptions[0];
        const foods = meal.items?.length ? mapClientItems(meal.items) : mapMealTemplateItems(singleOption?.mealTemplate.items ?? []);
  
        return {
          id: meal.id,
          title: meal.name,
          timeRange: null,
          notes: null,
          totalCalories: mealTotalCalories,
          options: [],
          selectedOptionId: null,
          foods,
          mealTemplateId: singleOption?.mealTemplate.id,
        };
      }
  
      return {
        id: meal.id,
        title: meal.name,
        timeRange: null,
        notes: null,
        totalCalories: mealTotalCalories,
        options,
        selectedOptionId: selectedId,
      };
    });
  }
  
  export function mapClientMenuToNutritionPlan(menu: ClientMenu): UINutritionPlan {
    if (!menu) {
      throw new Error("Cannot map undefined client menu");
    }
  
    const mappedMeals = mapMeals(menu.meals);
  
    return {
      id: menu.id,
      name: menu.name,
      source: "client",
      dayType: resolveDayType(menu.type),
      totalCalories:
        menu.totalCalories ?? mappedMeals.reduce((sum, meal) => sum + (meal.totalCalories ?? 0), 0),
      notes: menu.notes,
      vitamins: mapVitamins(menu.vitamins),
      meals: mappedMeals,
    };
  }