// src/llm/tools/workout/previewWorkout.tool.js
import { previewWorkout } from "../../../services/tools/workout/previewWorkout.logic.js";

export const previewWorkoutTool = {
  name: "preview_workout",
  description:
    "Checks how well the client's workout description matches a workout program, returns match level, warnings, and whether coach approval is required.",
  parameters: {
    type: "object",
    properties: {
      clientText: {
        type: "string",
        description: "Free text description from the client about the workout they did.",
      },
      program: {
        type: "object",
        description:
          "Workout program object (typically from get_workout_context). Must include exercises list with exercise names.",
        additionalProperties: true,
      },
    },
    required: ["clientText", "program"],
    additionalProperties: false,
  },

  async execute(args, context) {
    return PreviewWorkoutTool.execute(context, args);
  },
};
