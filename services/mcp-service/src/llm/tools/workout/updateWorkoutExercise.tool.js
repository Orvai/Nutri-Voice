// src/llm/tools/workout/updateWorkoutExercise.tool.js
import { patchWorkoutExercise } from "../../../services/tools/workout/workoutLog.service.js"; 

export const updateWorkoutExerciseTool = {
  name: "update_workout_exercise",
  description: "Updates a single exercise inside a workout log (e.g., change weight).",

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

    const { exerciseLogId, ...payload } = args;
    return patchWorkoutExercise(exerciseLogId, payload, context);
  },
};