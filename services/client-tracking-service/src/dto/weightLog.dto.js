const { z } = require('zod');

const WeightLogCreateDto = z.object({
  date: z.string().datetime().optional(),
  weightKg: z.number(),
  notes: z.string().optional()
}).strict();

const WeightLogResponseDto = z.object({
  id: z.string(),
  clientId: z.string(),
  date: z.string().datetime(),
  weightKg: z.number(),
  notes: z.string().nullable(),
  loggedAt: z.string().datetime().optional()
}).strict();

const WeightHistoryResponseDto = z.array(WeightLogResponseDto);


module.exports = { WeightLogCreateDto,WeightLogResponseDto,WeightHistoryResponseDto };