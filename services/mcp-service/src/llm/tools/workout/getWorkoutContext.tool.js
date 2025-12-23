// src/llm/tools/workout/getWorkoutContext.tool.js
import { GetWorkoutContextTool } from "../../../services/tools/workout/getWorkoutContext.tool.js";

export const getWorkoutContextTool = {
  name: "get_workout_context",
  description:
    "Fetches a single workout program (with exercises) for a client. Optional programId.",

  parameters: {
    type: "object",
    properties: {
      clientId: { type: "string", minLength: 1 },
      programId: { type: "string", minLength: 1 },
    },
    required: ["clientId"],
    additionalProperties: false,
  },

  async execute(args, context) {
    return GetWorkoutContextTool.execute(context, args);
  },
};
