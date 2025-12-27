import { z } from "zod";

/**
 * MetricsLogResponseDto
 */
export const MetricsToolDto = z.object({
  id: z.string(),
  clientId: z.string(),
  date: z.string().describe("ISO date string"),
  steps: z.number().int().nullable().describe("Number of steps logged"),
  waterLiters: z.number().nullable().describe("Amount of water in liters"),
  sleepHours: z.number().nullable().describe("Hours of sleep logged"),
  notes: z.string().nullable().describe("User or coach notes"),
  updatedAt: z.string().describe("Last update timestamp")
});

/**
 * UpsertMetricsToolDto
 */
export const UpsertMetricsToolDto = z.object({
  date: z.string()
    .optional()
    .describe("Optional ISO date string (YYYY-MM-DD). Defaults to today if not provided."),
    
  steps: z.number()
    .int()
    .min(0)
    .optional()
    .describe("Total daily steps. Set this when the user reports walking or activity."),
    
  waterLiters: z.number()
    .min(0)
    .optional()
    .describe("Water intake in liters (e.g., 0.5, 2.0). Use this when the user reports drinking."),
    
  sleepHours: z.number()
    .min(0)
    .max(24)
    .optional()
    .describe("Total hours of sleep. Usually updated once a day."),
    
  notes: z.string()
    .optional()
    .describe("Any context or thoughts the user shared about these metrics.")
}).strict();

/**
 * MetricsHistoryToolDto
 */
export const MetricsHistoryToolDto = z.array(MetricsToolDto);