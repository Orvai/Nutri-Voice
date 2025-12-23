// src/services/tools/previewWorkout.tool.js
import {
  PreviewWorkoutToolInputDto,
  PreviewWorkoutToolOutputDto,
} from "../../../dtos/tools/workout/previewWorkout.dto.js";
import { previewWorkout } from "./previewWorkout.logic.js";

export const PreviewWorkoutTool = {
  name: "preview_workout",
  description:
    "בודק התאמה בין תיאור האימון של הלקוח לבין תכנית האימון שבקונטקסט.",

  inputSchema: PreviewWorkoutToolInputDto,
  outputSchema: PreviewWorkoutToolOutputDto,

  async execute(context, rawInput) {
    const input = PreviewWorkoutToolInputDto.parse(rawInput);

    if (!input.program) {
      throw new Error("Missing workout program in input");
    }

    const result = previewWorkout({
      clientText: input.clientText,
      program: input.program,
    });

    return PreviewWorkoutToolOutputDto.parse(result);
  },
};
