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

    const exerciseList = (chosen.exercises ?? []).map((exercise) => ({
      id: exercise.id,
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.exercise?.name || "תרגיל",
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight ?? null,
      notes: exercise.notes ?? null,
    }));

    return GetWorkoutContextToolOutputDto.parse({
      currentProgram: chosen ?? null,
      workoutDay: chosen?.name ?? null,
      exerciseList,
      completionStatus: "UNKNOWN",
      notes: [],
      substitutions: [],
      progressionContext: {
        hasHistory: false,
        hint: null,
      },
    });
  },
};
