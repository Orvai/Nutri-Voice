import type { MealTemplateResponseDto } from "@common/api/sdk/schemas";
import type {
  UIFoodItem,
  UIMealTemplateKind,
} from "@/types/ui/nutrition/nutrition.types";

/* =====================================
   UI Model
===================================== */

export interface UIMealTemplate {
  id: string;
  name: string;
  kind: UIMealTemplateKind;
  items: UIFoodItem[];
}

/* =====================================
   Mapper
===================================== */

export function mapMealTemplate(
  dto: MealTemplateResponseDto
): UIMealTemplate {
  return {
    id: dto.id,
    name: dto.name,
    kind: dto.kind,
    items: dto.items.map(mapMealTemplateItem),
  };
}

/* =====================================
   Internal helpers
===================================== */

function mapMealTemplateItem(
  item: MealTemplateResponseDto["items"][number]
): UIFoodItem {
  return {
    id: item.id,
    foodItemId: item.foodItem.id,
    name: item.foodItem.name,
    role: item.role,
    grams: item.grams,

    // UI-only helpers
    color: "#E5E7EB",
    caloriesPer100g: item.foodItem.caloriesPer100g ?? null,
  };
}
