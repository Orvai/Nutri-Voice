// src/llm/tools/workout/reportWorkout.tool.js
import { createWorkoutLog } from "../../../services/tools/workout/workoutLog.service.js";
export const reportWorkoutTool = {
  name: "report_workout",
  description: "Reports a new completed workout.",

  parameters: {
    type: "object",
    properties: {
      date: { type: "string", format: "date-time" },
      workoutType: { type: "string", minLength: 1 },
      effortLevel: {
        type: "string",
        enum: ["EASY", "NORMAL", "HARD", "FAILED", "SKIPPED"],
      },
      notes: { type: "string" },
      exercises: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          properties: {
            exerciseName: { type: "string", minLength: 1 },
            weight: { type: ["number", "null"] },
          },
          required: ["exerciseName"],
          additionalProperties: false,
        },
      },
    },
    required: ["workoutType", "effortLevel", "exercises"],
    additionalProperties: false,
  },

  async execute(args, context) {
    return createWorkoutLog(args, context);
  },
};