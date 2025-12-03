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
});

module.exports = { MealLogCreateDto };