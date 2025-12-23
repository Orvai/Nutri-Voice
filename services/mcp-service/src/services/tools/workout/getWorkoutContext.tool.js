// src/services/tools/getWorkoutContext.tool.js
import {
  GetWorkoutContextToolInputDto,
  GetWorkoutContextToolOutputDto,
} from "../../../dtos/tools/workout/getWorkoutContext.dto.js";
import { fetchWorkoutPrograms } from "./workoutPrograms.service.js";

export const GetWorkoutContextTool = {
  name: "get_workout_context",
  description:
    "מביא תכנית אימון ספציפית (כולל תרגילים) עבור הלקוח כדי לתת ל-AI הקשר מלא.",

  inputSchema: GetWorkoutContextToolInputDto,
  outputSchema: GetWorkoutContextToolOutputDto,

  async execute(context, rawInput) {
    const input = GetWorkoutContextToolInputDto.parse(rawInput);

    const programs = await fetchWorkoutPrograms(null, context);
    if (!programs?.length) {
      throw new Error("No workout programs found for client");
    }

    let chosen = programs[0];
    if (input.programId) {
      const found = programs.find((p) => p.id === input.programId);
      if (found) chosen = found;
    }

    return GetWorkoutContextToolOutputDto.parse({ data: chosen });
  },
};
