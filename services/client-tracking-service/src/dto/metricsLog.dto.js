const { z } = require('zod');

const MetricsLogCreateDto = z.object({
  date: z.preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date()).optional(),
  steps: z.number().int().min(0).optional(),
  waterLiters: z.number().min(0).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  notes: z.string().optional()
}).strict();

const MetricsLogResponseDto = z.object({
  id: z.string(),
  clientId: z.string(),
  date: z.date(),
  steps: z.number().nullable(),
  waterLiters: z.number().nullable(),
  sleepHours: z.number().nullable(),
  notes: z.string().nullable(),
  updatedAt: z.date()
});

const MetricsHistoryResponseDto = z.array(MetricsLogResponseDto);

module.exports = {
  MetricsLogCreateDto,
  MetricsLogResponseDto,
  MetricsHistoryResponseDto
};