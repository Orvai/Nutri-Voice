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
});
