// src/services/tools/reportWorkout.tool.js
import {
    ReportWorkoutToolInputDto,
    ReportWorkoutToolOutputDto,
  } from "../../dto/tools/reportWorkout.dto.js";
  import { createWorkoutLog } from "./workoutLog.service.js";
  
  export const ReportWorkoutTool = {
    name: "report_workout",
    description:
      "מדווח בפועל אימון למערכת המעקב (workout-log). משנה מציאות רק אחרי שהתקבלה החלטה שיחתית.",
    inputSchema: ReportWorkoutToolInputDto,
    outputSchema: ReportWorkoutToolOutputDto,
  
    async execute(context, rawInput) {
      const input = ReportWorkoutToolInputDto.parse(rawInput);
  
      const result = await createWorkoutLog({
        userToken: context.userToken,
        payload: input,
      });
  
      return ReportWorkoutToolOutputDto.parse(result);
    },
  };
  