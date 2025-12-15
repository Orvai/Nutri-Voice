// src/mappers/nutrition/food.mapper.ts
import { FoodItemResponseDto } from "@common/api/sdk/schemas/foodItemResponseDto";
import { Food } from "@/types/ui/nutrition/food.ui";

export function mapFood(dto: FoodItemResponseDto): Food {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? undefined,
    category: dto.category?.toUpperCase() ,
    caloriesPer100g: dto.caloriesPer100g ?? undefined,
    proteinPer100g: dto.proteinPer100g ?? undefined,
  };
}
