// src/services/tools/updateWorkout.tool.js
import {
  UpdateWorkoutToolInputDto,
  UpdateWorkoutToolOutputDto,
} from "../../../../dtos/tools/workout/updateWorkout.dto.js";
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
