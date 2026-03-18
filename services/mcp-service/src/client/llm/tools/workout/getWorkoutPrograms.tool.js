// src/llm/tools/workout/getWorkoutPrograms.tool.js
import { GetWorkoutProgramsTool } from "../../../services/tools/workout/getWorkoutPrograms.tool.js";

export const getWorkoutProgramsTool = {
  name: "get_workout_programs",
  description:
    "Fetches all workout programs for current conversation client (client id comes from trusted runtime context).",

  parameters: {
    type: "object",
    properties: {
      includeExercises: { type: "boolean" },
    },
    required: [],
    additionalProperties: false,
  },

  async execute(args, context) {
    return GetWorkoutProgramsTool.execute(context, args);
  },
};
