const { z } = require('zod');

const DayTypeEnum = z.enum(['LOW', 'HIGH', 'MEDIUM', 'REST']);

const DaySelectionCreateDto = z.object({
  dayType: DayTypeEnum,
  date: z.string().datetime().optional()
});
const DaySelectionResponseDto = z.object({
  id: z.string(),
  clientId: z.string(),
  date: z.string().datetime(),
  dayType: DayTypeEnum,
  changedAt: z.string().datetime()
});

module.exports = { DaySelectionCreateDto, DayTypeEnum,DaySelectionResponseDto };