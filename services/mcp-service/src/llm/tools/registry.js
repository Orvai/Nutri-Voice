// src/llm/tools/toolRegistry.js

import { GetDailyStateTool } from "./DailyState/getDailyState.tool.js";
import { AskCaloriesTool } from "./menu-meal/askCalories.tool.js";

import { getMenuContextTool } from "./menu-meal/getMenuContext.tool.js";
import { previewMealTool } from "./menu-meal/previewMeal.tool.js";

import { reportMealTool } from "./menu-meal/reportMeal.tool.js";
import { updateMealTool } from "./menu-meal/updateMeal.tool.js";

import { shouldCoachReplyTool } from "./shouldCoachReply.tool.js";

// ===============================
// Workout tools
// ===============================
import { getWorkoutProgramsTool } from "./workout/getWorkoutPrograms.tool.js";
import { getWorkoutContextTool } from "./workout/getWorkoutContext.tool.js";
import { previewWorkoutTool } from "./workout/previewWorkout.tool.js";
import { reportWorkoutTool } from "./workout/reportWorkout.tool.js";
import { updateWorkoutTool } from "./workout/updateWorkout.tool.js";
import { updateWorkoutExerciseTool } from "./workout/updateWorkoutExercise.tool.js";

export const toolRegistry = {
  // ======================================================
  // Context Fetching (Source of Truth, NO side effects)
  // ======================================================
  get_daily_state: GetDailyStateTool,
  get_menu_context: getMenuContextTool,
  get_workout_programs: getWorkoutProgramsTool,
  get_workout_context: getWorkoutContextTool,

  // ======================================================
  // Decision / Reasoning (NO side effects)
  // ======================================================
  preview_meal: previewMealTool,
  preview_workout: previewWorkoutTool,
  ask_calories: AskCaloriesTool,

  // ======================================================
  // Side Effects (Mutate reality)
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
