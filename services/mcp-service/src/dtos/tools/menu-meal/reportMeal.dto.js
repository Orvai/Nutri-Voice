// dto/tools/reportMeal.dto.js
import { z } from "zod";

export const ReportMealInputDto = z.object({
  date: z.string().datetime().optional(),

  calories: z.number().int(),
  protein: z.number().int(),
  carbs: z.number().int(),
  fat: z.number().int(),

  description: z.string().optional(),
  matchedMenuItemId: z.string().optional(),

  dayType: z.enum(["TRAINING", "REST"]),

  source: z.enum(["MENU_MATCH", "ESTIMATE", "USER_PROVIDED"]).optional(),
  confidence: z.number().min(0).max(1).optional(),
  isEstimated: z.boolean().optional(),
  outsideMenu: z.boolean().optional(),
  portionText: z.string().optional(),
  caloriesUsedForLog: z.number().int().optional(),
});

export const ReportMealResponseDto = z.object({
  data: z.object({
    id: z.string(),
    clientId: z.string(),
    date: z.string().datetime(),
    dayType: z.enum(["TRAINING", "REST"]),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    description: z.string().nullable(),
    matchedMenuItemId: z.string().nullable(),
    loggedAt: z.string().datetime().optional(),
  }),
  meta: z.object({
    source: z.enum(["MENU_MATCH", "ESTIMATE", "USER_PROVIDED"]),
    confidence: z.number().min(0).max(1).nullable(),
    isEstimated: z.boolean(),
    outsideMenu: z.boolean(),
    portionText: z.string().nullable(),
    caloriesUsedForLog: z.number().int(),
  }),
});
