// src/llm/tools/workout/updateWorkoutExercise.tool.js
import { patchWorkoutExercise } from "../../../services/tools/workout/workoutLog.service.js"; 
import {
  UpdateWorkoutExerciseToolInputDto,
  UpdateWorkoutExerciseToolOutputDto,
} from "../../../dtos/tools/workout/updateWorkout.dto.js";

export const updateWorkoutExerciseTool = {
  name: "update_workout_exercise",
  description:
    "Updates a specific exercise row in a workout log. Provide only changed fields for targeted update.",

  parameters: {
    type: "object",
    properties: {
      exerciseLogId: { type: "string", minLength: 1, description: "The ID of the specific exercise row" },
      exerciseName: { type: "string", description: "Optional: update name" },
      weight: { type: "number", description: "Optional: update weight in KG" },
    },
    required: ["exerciseLogId"], 
    additionalProperties: false,
  },

  async execute(args, context) {
    const parsed = UpdateWorkoutExerciseToolInputDto.parse(args);
    const { exerciseLogId, ...payload } = parsed;
    const changedFields = Object.keys(payload).filter((key) => payload[key] !== undefined);
    if (changedFields.length === 0) {
      throw new Error("At least one exercise field must be provided for update");
    }

    const result = await patchWorkoutExercise(exerciseLogId, payload, context);
    return UpdateWorkoutExerciseToolOutputDto.parse({
      success: true,
      id: result?.id || exerciseLogId,
      message: "Workout exercise updated",
      diff: {
        changedFields,
      },
    });
  },
};
