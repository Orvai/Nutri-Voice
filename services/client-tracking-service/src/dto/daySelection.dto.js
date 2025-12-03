const { z } = require('zod');

const DayTypeEnum = z.enum(['LOW', 'HIGH', 'MEDIUM', 'REST']);

const DaySelectionCreateDto = z.object({
  dayType: DayTypeEnum,
  date: z.string().datetime().optional()
});

module.exports = { DaySelectionCreateDto, DayTypeEnum };