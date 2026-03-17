const { z } = require('zod');

const dateTimeField = z.union([
  z.string().datetime(),
  z.date().transform((d) => d.toISOString()),
]);

const WeightLogCreateDto = z.object({
  date: z.string().datetime().optional(),
  weightKg: z.number(),
  notes: z.string().optional()
}).strict();

const WeightLogResponseDto = z.object({
  id: z.string(),
  clientId: z.string(),
  date: dateTimeField,
  weightKg: z.number(),
  notes: z.string().nullable(),
  loggedAt: dateTimeField.optional()
}).strict();

const WeightLogUpdateDto = z.object({
  weightKg: z.number().optional(),
  notes: z.string().nullable().optional()
}).strict();

const WeightHistoryResponseDto = z.array(WeightLogResponseDto);


module.exports = { WeightLogCreateDto,WeightLogResponseDto,WeightHistoryResponseDto,WeightLogUpdateDto };
