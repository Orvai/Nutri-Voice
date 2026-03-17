// src/llm/tools/workout/updateWorkout.tool.js
import { updateWorkoutLog } from "../../../services/tools/workout/workoutLog.service.js";
import {
  UpdateWorkoutToolInputDto,
  UpdateWorkoutToolOutputDto,
} from "../../../dtos/tools/workout/updateWorkout.dto.js";

export const updateWorkoutTool = {
  name: "update_workout",
  description:
    "Updates an existing workout log. Provide only changed fields; tool enforces at least one change.",

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
    const parsed = UpdateWorkoutToolInputDto.parse(args);
    const { logId, ...payload } = parsed;
    const changedFields = Object.keys(payload).filter((key) => payload[key] !== undefined);
    if (changedFields.length === 0) {
      throw new Error("At least one workout field must be provided for update");
    }

    const result = await updateWorkoutLog(logId, payload, context);
    return UpdateWorkoutToolOutputDto.parse({
      data: result?.data ?? result,
      diff: {
        changedFields,
      },
    });
  },
};
