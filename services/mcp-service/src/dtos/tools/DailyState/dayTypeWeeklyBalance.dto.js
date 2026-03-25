import { z } from "zod";

const DayTypeSchema = z.enum(["TRAINING", "REST"]);

const DayTypeWeeklyBalanceItemDto = z.object({
  dayType: DayTypeSchema,
  label: z.string(),
  allowedDaysPerWeek: z.number().int().min(0).max(7).nullable(),
  usedDaysThisWeek: z.number().int().nonnegative(),
  remainingDaysThisWeek: z.number().int().nonnegative().nullable(),
  projectedCountIfSelectedToday: z.number().int().nonnegative(),
  isWithinLimitIfSelectedToday: z.boolean(),
});

export const DayTypeWeeklyBalanceDto = z.object({
  weekStartDate: z.string(),
  weekEndDate: z.string(),
  targetDate: z.string().nullable(),
  currentDayTypeForTargetDate: DayTypeSchema.nullable(),
  dayTypes: z.object({
    TRAINING: DayTypeWeeklyBalanceItemDto,
    REST: DayTypeWeeklyBalanceItemDto,
  }),
  summaryText: z.string(),
});

