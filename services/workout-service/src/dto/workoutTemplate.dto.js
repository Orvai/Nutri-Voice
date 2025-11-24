const { z } = require("zod");

const WorkoutTemplateResponseDto = z.object({
  id: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  level: z.number(),
  bodyType: z.enum(["ECTO", "ENDO"]).nullable(),
  workoutType: z.string(),
  muscleGroups: z.array(z.string()),
  name: z.string().nullable(),
  notes: z.string().nullable(),
});

module.exports = { WorkoutTemplateResponseDto };
