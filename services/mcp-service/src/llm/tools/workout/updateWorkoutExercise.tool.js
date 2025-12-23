// src/llm/tools/workout/updateWorkoutExercise.tool.js
import { UpdateWorkoutTool } from "../../../services/tools/workout/updateWorkoutExercise.tool.js";
UpdateWorkoutTool
export const updateWorkoutExerciseTool = {
  name: "update_workout_exercise",
  description:
    "Updates a single exercise inside a workout log (side effect).",

  parameters: {
    type: "object",
    properties: {
      exerciseLogId: { type: "string", minLength: 1 },
      id: { type: "string", minLength: 1 },
      exerciseName: { type: "string", minLength: 1 },
      weight: { type: ["number", "null"] },
    },
    required: ["exerciseLogId", "id", "exerciseName"],
    additionalProperties: false,
  },

  async execute(args, context) {
    return UpdateWorkoutTool.execute(context, args);
  },
};
