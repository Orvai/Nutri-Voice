// src/services/tools/updateWorkoutExercise.tool.js
import {
    UpdateWorkoutExerciseToolInputDto,
    UpdateWorkoutExerciseToolOutputDto,
  } from "../../dto/tools/updateWorkoutExercise.dto.js";
  import { patchWorkoutExercise } from "./workout/workoutLog.service.js";
  
  export const UpdateWorkoutExerciseTool = {
    name: "update_workout_exercise",
    description:
      "מאפשר עדכון של תרגיל בודד בתוך workout log (PATCH exercise entry) כדי לתקן משקל/שם תרגיל מבלי לעדכן את כל הלוג.",
    inputSchema: UpdateWorkoutExerciseToolInputDto,
    outputSchema: UpdateWorkoutExerciseToolOutputDto,
  
    async execute(context, rawInput) {
      const input = UpdateWorkoutExerciseToolInputDto.parse(rawInput);
  
      const { exerciseLogId, ...payload } = input;
  
      const result = await patchWorkoutExercise({
        userToken: context.userToken,
        exerciseLogId,
        payload,
      });
  
      return UpdateWorkoutExerciseToolOutputDto.parse(result);
    },
  };
  