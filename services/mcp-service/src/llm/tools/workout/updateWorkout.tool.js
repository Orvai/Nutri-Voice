// src/llm/tools/workout/updateWorkout.tool.js
import { UpdateWorkoutTool } from "../../../services/tools/workout/updateWorkout.tool.js";

export const updateWorkoutTool = {
  name: "update_workout",
  description:
    "Updates an existing workout log (side effect).",

  parameters: {
    type: "object",
    properties: {
      logId: { type: "string", minLength: 1 },
      workoutType: { type: "string" },
      effortLevel: {
        type: "string",
        enum: ["EASY", "NORMAL", "HARD", "FAILED", "SKIPPED"],
      },
      notes: { type: "string" },
      exercises: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            exerciseName: { type: "string", minLength: 1 },
            weight: { type: ["number", "null"] },
          },
          required: ["id", "exerciseName"],
          additionalProperties: false,
        },
      },
    },
    required: ["logId"],
    additionalProperties: false,
  },

  async execute(args, context) {
    return UpdateWorkoutTool.execute(context, args);
  },
};
