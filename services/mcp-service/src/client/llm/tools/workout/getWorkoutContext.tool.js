// src/llm/tools/workout/getWorkoutContext.tool.js
import { GetWorkoutContextTool } from "../../../services/tools/workout/getWorkoutContext.tool.js";

export const getWorkoutContextTool = {
  name: "get_workout_context",
  description:
    "Fetches current workout context for conversation client: selected program, exercise list, completion status and progression hints. Optional programId.",

  parameters: {
    type: "object",
    properties: {
      programId: { type: "string", minLength: 1 },
    },
    required: [],
    additionalProperties: false,
  },

  async execute(args, context) {
    return GetWorkoutContextTool.execute(context, args);
  },
};
