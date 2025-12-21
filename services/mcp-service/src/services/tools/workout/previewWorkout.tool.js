// src/services/tools/previewWorkout.tool.js
import {
    PreviewWorkoutToolInputDto,
    PreviewWorkoutToolOutputDto,
  } from "../../dto/tools/previewWorkout.dto.js";
  import { previewWorkout } from "./previewWorkout.logic.js";
  
  export const PreviewWorkoutTool = {
    name: "preview_workout",
    description:
      "בודק התאמה בין תיאור האימון של הלקוח לבין תכנית האימון שבקונטקסט ומחזיר רמת התאמה ואזהרות כדי לדעת אם אפשר לדווח או צריך אישור מאמן.",
    inputSchema: PreviewWorkoutToolInputDto,
    outputSchema: PreviewWorkoutToolOutputDto,
  
    async execute(context, rawInput) {
      const input = PreviewWorkoutToolInputDto.parse(rawInput);
  
      const result = previewWorkout({
        clientText: input.clientText,
        program: input.program,
      });
  
      return PreviewWorkoutToolOutputDto.parse(result);
    },
  };
  