// src/services/tools/updateWorkout.tool.js
import {
    UpdateWorkoutToolInputDto,
    UpdateWorkoutToolOutputDto,
  } from "../../dto/tools/updateWorkout.dto.js";
  import { updateWorkoutLog } from "./workoutLog.service.js";
  
  export const UpdateWorkoutTool = {
    name: "update_workout",
    description:
      "מאפשר עדכון של workout log קיים (workoutType/effortLevel/notes/תרגילים) כדי לתמוך בתיקון טעויות אחרי דיווח.",
    inputSchema: UpdateWorkoutToolInputDto,
    outputSchema: UpdateWorkoutToolOutputDto,
  
    async execute(context, rawInput) {
      const input = UpdateWorkoutToolInputDto.parse(rawInput);
  
      const { logId, ...payload } = input;
  
      const result = await updateWorkoutLog({
        userToken: context.userToken,
        logId,
        payload,
      });
  
      return UpdateWorkoutToolOutputDto.parse(result);
    },
  };
  