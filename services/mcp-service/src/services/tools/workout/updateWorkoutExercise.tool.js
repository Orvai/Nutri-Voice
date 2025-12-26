// src/services/tools/updateWorkoutExercise.tool.js
import {UpdateWorkoutExerciseToolInputDto,UpdateWorkoutExerciseToolOutputDto,} from "../../../dtos/tools/workout/updateWorkout.dto.js";
import { patchWorkoutExercise } from "./workoutLog.service.js";

export const UpdateWorkoutExerciseTool = {
  name: "update_workout_exercise",
  description:"עדכון פרטים של תרגיל בודד (למשל משקל) בתוך אימון קיים, לפי exerciseLogId.",
  inputSchema: UpdateWorkoutExerciseToolInputDto,
  outputSchema: UpdateWorkoutExerciseToolOutputDto,

  async execute(context, rawInput) {
    const input = UpdateWorkoutExerciseToolInputDto.parse(rawInput);
    const { exerciseLogId, ...payload } = input;

    const result = await patchWorkoutExercise(exerciseLogId, payload, context);

    return UpdateWorkoutExerciseToolOutputDto.parse({
      success: true,
      id: result.id, 
      message: `Exercise updated successfully to ${result.weight}kg`,
    });
  },
};