// src/llm/tools/workout/reportWorkout.tool.js
import { ReportWorkoutTool } from "../../../services/tools/workout/reportWorkout.tool.js";

export const reportWorkoutTool = {
  name: "report_workout",
  description:
    "Reports a completed workout and creates a workout log (side effect).",

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
    return ReportWorkoutTool.execute(context, args);
  },
};
