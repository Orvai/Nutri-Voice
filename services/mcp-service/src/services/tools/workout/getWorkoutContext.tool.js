// src/services/tools/getWorkoutContext.tool.js
import {
    GetWorkoutContextToolInputDto,
    GetWorkoutContextToolOutputDto,
  } from "../../dto/tools/getWorkoutContext.dto.js";
  import { fetchWorkoutPrograms } from "./workoutPrograms.service.js";
  
  export const GetWorkoutContextTool = {
    name: "get_workout_context",
    description:
      "מביא תכנית אימון ספציפית (כולל תרגילים) עבור לקוח כדי לתת ל-AI הקשר מלא לפני preview/report.",
    inputSchema: GetWorkoutContextToolInputDto,
    outputSchema: GetWorkoutContextToolOutputDto,
  
    async execute(context, rawInput) {
      const input = GetWorkoutContextToolInputDto.parse(rawInput);
  
      const result = await fetchWorkoutPrograms({
        userToken: context.userToken,
        clientId: input.clientId,
      });
  
      const programs = Array.isArray(result) ? result : result?.data || [];
      if (!programs.length) {
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
  