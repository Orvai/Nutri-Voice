// src/llm/tools/toolRegistry.js

import { GetDailyStateTool } from "./getDailyState.tool.js";
import { AskCaloriesTool } from "./askCalories.tool.js";

import { getMenuContextTool } from "./getMenuContext.tool.js";
import { previewMealTool } from "./previewMeal.tool.js";

import { reportMealTool } from "./reportMeal.tool.js";
import { updateMealTool } from "./updateMeal.tool.js";

import { shouldCoachReplyTool } from "./shouldCoachReply.tool.js";

// ===============================
// Workout tools
// ===============================
import { getWorkoutProgramsTool } from "./getWorkoutPrograms.tool.js";
import { getWorkoutContextTool } from "./getWorkoutContext.tool.js";
import { previewWorkoutTool } from "./previewWorkout.tool.js";

import { reportWorkoutTool } from "./reportWorkout.tool.js";
import { updateWorkoutTool } from "./updateWorkout.tool.js";
import { updateWorkoutExerciseTool } from "./updateWorkoutExercise.tool.js";

export const toolRegistry = {
  // ======================================================
  // Source of Truth (NO side effects)
  // ======================================================
  get_daily_state: GetDailyStateTool,
  get_menu_context: getMenuContextTool,
  get_workout_programs: getWorkoutProgramsTool,
  get_workout_context: getWorkoutContextTool,

  // ======================================================
  // Logic / Decision support (NO side effects)
  // ======================================================
  preview_meal: previewMealTool,
  preview_workout: previewWorkoutTool,
  ask_calories: AskCaloriesTool,

  // ======================================================
  // Side Effects (mutate reality)
  // ======================================================
  report_meal: reportMealTool,
  update_meal: updateMealTool,

  report_workout: reportWorkoutTool,
  update_workout: updateWorkoutTool,
  update_workout_exercise: updateWorkoutExerciseTool,

  // ======================================================
  // Governance
  // ======================================================
  should_coach_reply: shouldCoachReplyTool,
};
