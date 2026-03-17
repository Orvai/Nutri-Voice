// src/services/tools/getWorkoutPrograms.tool.js
import {
  GetWorkoutProgramsToolInputDto,
  GetWorkoutProgramsToolOutputDto,
} from "../../../dtos/tools/workout/getWorkoutPrograms.dto.js";
import { fetchWorkoutPrograms } from "./workoutPrograms.service.js";

export const GetWorkoutProgramsTool = {
  name: "get_workout_programs",
  description:
    "מביא את כל תוכניות האימון של הלקוח (כולל תרגילים) כדי לאפשר הקשר לפני דיווח.",

  inputSchema: GetWorkoutProgramsToolInputDto,
  outputSchema: GetWorkoutProgramsToolOutputDto,

  async execute(context, rawInput) {
    GetWorkoutProgramsToolInputDto.parse(rawInput); // אין payload משמעותי

    const result = await fetchWorkoutPrograms(null, context);
    const data = Array.isArray(result) ? result : result?.data ?? [];
    const summaries = data.map((program) => ({
      id: program.id,
      name: program.name,
      exerciseCount: (program.exercises ?? []).length,
      muscleGroups: [
        ...new Set(
          (program.exercises ?? [])
            .map((e) => e.exercise?.muscleGroup)
            .filter(Boolean)
        ),
      ],
    }));

    return GetWorkoutProgramsToolOutputDto.parse({
      data,
      summaries,
    });
  },
};
