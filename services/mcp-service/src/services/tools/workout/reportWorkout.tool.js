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
