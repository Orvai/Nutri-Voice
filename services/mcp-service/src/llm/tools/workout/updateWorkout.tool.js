// src/llm/tools/workout/updateWorkout.tool.js
import { updateWorkoutLog } from "../../../services/tools/workout/workoutLog.service.js";

export const updateWorkoutTool = {
  name: "update_workout",
  description: "Updates an existing workout log header (effort, type, notes).",

  parameters: {
    type: "object",
    properties: {
      logId: { type: "string", minLength: 1, description: "The Workout Log ID" },
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
            exerciseName: { type: "string" },
            weight: { type: ["number", "null"] },
          },
        },
      },
    },
    required: ["logId"],
    additionalProperties: false,
  },

  async execute(args, context) {
    const { logId, ...payload } = args;
    return updateWorkoutLog(logId, payload, context);
  },
};