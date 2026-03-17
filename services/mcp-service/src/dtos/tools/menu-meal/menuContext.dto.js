// dto/tools/menuContext.dto.js
import { z } from "zod";

const MenuItemDto = z.object({
  foodItemId: z.string().nullable(),
  foodName: z.string(),
  role: z.string().nullable().optional(),
  grams: z.number().nullable().optional(),
  caloriesPer100g: z.number().nullable().optional(),
});

export const MenuContextDto = z.object({
  requiresDayType: z.boolean().default(false),
  availableDayTypes: z.array(z.enum(["TRAINING", "REST"])).default(["TRAINING", "REST"]),
  dayType: z.enum(["TRAINING", "REST"]).nullable(),

  menuId: z.string().nullable(),
  name: z.string().nullable(),
  notes: z.string().nullable(),

  menuItems: z.array(MenuItemDto).default([]),
  normalizedFoodIndex: z.array(
    z.object({
      token: z.string(),
      foodItemId: z.string().nullable(),
      foodName: z.string(),
      synonyms: z.array(z.string()).default([]),
      portionUnits: z.array(z.string()).default([]),
    })
  ).default([]),
  candidateMatches: z.array(
    z.object({
      foodItemId: z.string().nullable(),
      foodName: z.string(),
      confidence: z.number().min(0).max(1).optional(),
    })
  ).default([]),
  synonyms: z.record(z.array(z.string())).default({}),
  portionUnits: z.array(z.string()).default(["גרם", "יחידה", "כף", "כוס"]),
  inMenu: z.boolean().nullable().default(null),
  likelyMatch: z.string().nullable().default(null),
  mismatchReason: z.string().nullable().default(null),

  meals: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      notes: z.string().nullable(),
      totalCalories: z.number(),

      options: z.array(
        z.object({
          id: z.string(),
          name: z.string().nullable(),

          items: z.array(
            MenuItemDto
          ),
        })
      ),
    })
  ).default([]),

  vitamins: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      notes: z.string().nullable(),
    })
  ).default([]),
});
