import { z } from "zod";

export const AskCaloriesResultDto = z.object({
  kind: z.enum(["DAILY_REMAINING", "FOOD_ESTIMATE"]).default("DAILY_REMAINING"),
  requiresDayType: z.boolean().default(false),
  requiresUserClarification: z.boolean().default(false),
  queryFoodText: z.string().optional(),
  estimatedCalories: z.number().int().nullable().optional(),
  portionAssumption: z.string().nullable().optional(),
  confidence: z.number().min(0).max(1).nullable().optional(),
  inMenu: z.boolean().nullable().optional(),
  matchedMenuItem: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  outsideMenu: z.boolean().optional(),
  dailyImpact: z.object({
    dailyCaloriesTarget: z.number().int().nullable(),
    consumedCalories: z.number().int(),
    remainingCalories: z.number().int().nullable(),
  }),
  recommendationFlag: z.enum(["ON_TRACK", "WATCH_PORTION", "OVER_BUDGET", "NO_TARGET"]),
  summary: z.string(),
  replyText: z.string().optional(),
});
