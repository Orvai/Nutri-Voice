// src/services/tools/reportWorkout.tool.js
import {
  ReportWorkoutToolInputDto,
  ReportWorkoutToolOutputDto,
} from "../../../dtos/tools/workout/reportWorkout.dto.js";
import { createWorkoutLog } from "./workoutLog.service.js";

export const ReportWorkoutTool = {
  name: "report_workout",
  description:
    "מדווח אימון בפועל למערכת המעקב. משנה מציאות רק לאחר החלטה שיחתית.",

  inputSchema: ReportWorkoutToolInputDto,
  outputSchema: ReportWorkoutToolOutputDto,

  async execute(context, rawInput) {
    const input = ReportWorkoutToolInputDto.parse(rawInput);

    const result = await createWorkoutLog(input, context);

    return ReportWorkoutToolOutputDto.parse(result);
  },
};
