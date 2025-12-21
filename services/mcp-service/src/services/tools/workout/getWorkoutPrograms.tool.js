// src/services/tools/getWorkoutPrograms.tool.js
import {
    GetWorkoutProgramsToolInputDto,
    GetWorkoutProgramsToolOutputDto,
  } from "../../dto/tools/getWorkoutPrograms.dto.js";
  import { fetchWorkoutPrograms } from "./workoutPrograms.service.js";
  
  export const GetWorkoutProgramsTool = {
    name: "get_workout_programs",
    description:
      "מביא את כל תוכניות האימון של לקוח (כולל רשימת תרגילים לכל תוכנית) כדי לאפשר ל-AI לבחור תכנית נכונה לפני דיווח אימון.",
    inputSchema: GetWorkoutProgramsToolInputDto,
    outputSchema: GetWorkoutProgramsToolOutputDto,
  
    async execute(context, rawInput) {
      const input = GetWorkoutProgramsToolInputDto.parse(rawInput);
  
      const result = await fetchWorkoutPrograms({
        userToken: context.userToken,
        clientId: input.clientId,
      });
  
      const normalized = Array.isArray(result) ? { data: result } : result;
  
      return GetWorkoutProgramsToolOutputDto.parse(normalized);
    },
  };
  