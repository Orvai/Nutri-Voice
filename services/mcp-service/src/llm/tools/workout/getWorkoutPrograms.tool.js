// src/llm/tools/workout/getWorkoutPrograms.tool.js
import { GetWorkoutProgramsTool } from "../../../services/tools/workout/getWorkoutPrograms.tool.js";

export const getWorkoutProgramsTool = {
  name: "get_workout_programs",
  description:
    "Fetches all workout programs for a specific client.",

  parameters: {
    type: "object",
    properties: {
      clientId: { type: "string", minLength: 1 },
    },
    required: ["clientId"],
    additionalProperties: false,
  },

  async execute(args, context) {
    return GetWorkoutProgramsTool.execute(context, args);
  },
};
