const { z } = require('zod');

const WeightLogCreateDto = z.object({
  date: z.string().datetime().optional(),
  weightKg: z.number(),
  notes: z.string().optional()
});

module.exports = { WeightLogCreateDto };