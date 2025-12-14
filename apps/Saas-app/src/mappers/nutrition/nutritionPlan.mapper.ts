// ==============================
// API DTOs (Orval)
// ==============================
import { TemplateMenuResponseDto } from "@common/api/sdk/schemas/templateMenuResponseDto";
import { ClientMenuResponseDto } from "@common/api/sdk/schemas/clientMenuResponseDto";

// ==============================
// UI Types
// ==============================
import {
  UINutritionPlan,
  UIDayType,
  UINutritionSource,
} from "@/types/ui/nutrition/nutrition.types";

// ==============================
// Existing mappers (validated)
// ==============================
import { mapTemplateMenu } from "./templateMenu.mapper";
import { mapClientMenu } from "./clientMenu.mapper";
import { mapVitamin } from "./vitamin.mapper";

/* ============================================================================
   TEMPLATE MENU → UI NUTRITION PLAN
============================================================================ */

export function mapTemplateMenuToNutritionPlan(
  dto: TemplateMenuResponseDto
): UINutritionPlan {
  const mapped = mapTemplateMenu(dto);

  return {
    id: mapped.id,
    name: mapped.name,
    source: "template",
    dayType: dto.dayType as UIDayType,
    totalCalories: mapped.totalCalories,
    notes: mapped.notes,
    meals: mapped.meals,
    vitamins: mapped.vitamins.map(v => ({
      ...v,
      description: v.description ?? null,
    })),
  };
}

/* ============================================================================
   CLIENT MENU → UI NUTRITION PLAN
============================================================================ */

export function mapClientMenuToNutritionPlan(
  dto: ClientMenuResponseDto
): UINutritionPlan {
  const mapped = mapClientMenu(dto);

  return {
    id: mapped.id,
    name: mapped.name,
    source: "client",
    dayType: dto.type as UIDayType,
    totalCalories: mapped.totalCalories,
    notes: mapped.notes,
    meals: mapped.meals,
    vitamins: mapped.vitamins.map(v => ({
      ...v,
      description: v.description ?? null,
    })),
  };
}

/* ============================================================================
   GENERIC ENTRY POINT
============================================================================ */

export function mapNutritionPlan(
  dto: TemplateMenuResponseDto | ClientMenuResponseDto,
  source: UINutritionSource
): UINutritionPlan {
  return source === "client"
    ? mapClientMenuToNutritionPlan(dto as ClientMenuResponseDto)
    : mapTemplateMenuToNutritionPlan(dto as TemplateMenuResponseDto);
}
