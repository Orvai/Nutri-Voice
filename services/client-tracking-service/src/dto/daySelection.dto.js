const { z } = require('zod');

const DayTypeEnum = z.enum(['TRAINING', 'REST']);

const DaySelectionCreateDto = z.object({
  dayType: DayTypeEnum,
  date: z.string().datetime().optional()
}).strict();
const DaySelectionResponseDto = z.object({
  id: z.string(),
  clientId: z.string(),
  date: z.date(),
  dayType: DayTypeEnum,
  changedAt: z.date()
}).strict();

module.exports = { DaySelectionCreateDto, DayTypeEnum,DaySelectionResponseDto };