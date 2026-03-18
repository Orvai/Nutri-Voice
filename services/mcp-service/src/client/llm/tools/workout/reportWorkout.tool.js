// src/llm/tools/workout/reportWorkout.tool.js
import { createWorkoutLog } from "../../../services/tools/workout/workoutLog.service.js";
import {
  ReportWorkoutToolInputDto,
  ReportWorkoutToolOutputDto,
} from "../../../../dtos/tools/workout/reportWorkout.dto.js";
export const reportWorkoutTool = {
  name: "report_workout",
  description:
    "Reports a completed workout quickly. Supports optional runtime metadata (duration/intensity/performedAsPlanned/caloriesBurnEstimate).",

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
      durationMin: { type: "integer" },
      intensity: {
        type: "string",
        enum: ["LOW", "MEDIUM", "HIGH"],
      },
      performedAsPlanned: { type: "boolean" },
      caloriesBurnEstimate: { type: "integer" },
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
    const input = ReportWorkoutToolInputDto.parse(args);
    const payload = {
      date: input.date,
      workoutType: input.workoutType,
      effortLevel: input.effortLevel,
      notes: input.notes,
      exercises: input.exercises,
    };
    const result = await createWorkoutLog(payload, context);

    return ReportWorkoutToolOutputDto.parse({
      data: result?.data ?? result,
      meta: {
        durationMin: input.durationMin ?? null,
        intensity: input.intensity ?? null,
        performedAsPlanned:
          typeof input.performedAsPlanned === "boolean"
            ? input.performedAsPlanned
            : null,
        caloriesBurnEstimate: input.caloriesBurnEstimate ?? null,
      },
    });
  },
};
