const { z } = require("zod");

const ClientMenuCaloriesDto = z.object({
  trainingDayCalories: z.number().int(),
  restDayCalories: z.number().int()
}).strict();

module.exports = { ClientMenuCaloriesDto };
