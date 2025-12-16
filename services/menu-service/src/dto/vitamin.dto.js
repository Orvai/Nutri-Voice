const { z } = require("zod");

const VitaminCreateDto = z
  .object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
  })
  .strict();

module.exports = {
  VitaminCreateDto,
};