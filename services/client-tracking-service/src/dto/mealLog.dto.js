const { z } = require('zod');
const { DayTypeEnum } = require('./daySelection.dto');

const MealLogCreateDto = z.object({
  date: z.string().datetime().optional(),
  calories: z.number().int(),
  protein: z.number().int(),
  carbs: z.number().int(),
  fat: z.number().int(),
  description: z.string().optional(),
  matchedMenuItemId: z.string().optional(),
  dayType: DayTypeEnum
}).strict();
const MealLogResponseDto = z.object({
  id: z.string(),
  clientId: z.string(),
  date: z.string().datetime(),
  dayType: z.enum(["LOW", "HIGH", "MEDIUM", "REST"]),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  description: z.string().nullable(),
  matchedMenuItemId: z.string().nullable(),
  loggedAt: z.string().datetime().optional()
}).strict();

module.exports = { MealLogCreateDto,MealLogResponseDto };