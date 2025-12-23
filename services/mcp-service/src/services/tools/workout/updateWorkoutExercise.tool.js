// src/services/tools/updateWorkout.tool.js
import {
  UpdateWorkoutToolInputDto,
  UpdateWorkoutToolOutputDto,
} from "../../../dtos/tools/workout/updateWorkout.dto.js";
import { updateWorkoutLog } from "./workoutLog.service.js";

export const UpdateWorkoutTool = {
  name: "update_workout",
  description:
    "מאפשר עדכון של workout log קיים (סוג אימון / מאמץ / הערות / תרגילים).",

  inputSchema: UpdateWorkoutToolInputDto,
  outputSchema: UpdateWorkoutToolOutputDto,

  async execute(context, rawInput) {
    const input = UpdateWorkoutToolInputDto.parse(rawInput);
    const { logId, ...payload } = input;

    const result = await updateWorkoutLog(logId, payload, context);

    return UpdateWorkoutToolOutputDto.parse(result);
  },
};
