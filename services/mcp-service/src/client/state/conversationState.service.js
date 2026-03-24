import {
  getConversationState,
  patchConversationState,
} from "../../infra/state/conversationState.store.js";
import { rememberResolvedDayType } from "./dayType.service.js";

export { getConversationState, patchConversationState };

export async function updateConversationStateByTool({
  conversationId,
  toolName,
  args,
  toolResult,
}) {
  if (toolName === "get_daily_state" && toolResult?.dayType) {
    return rememberResolvedDayType(conversationId, toolResult.dayType, "TOOL_DAILY_STATE");
  }

  if (toolName === "get_menu_context") {
    return patchConversationState(conversationId, {
      last_menu_check: {
        dayType: toolResult?.dayType || undefined,
        inMenu: toolResult?.inMenu ?? null,
        likelyMatch: toolResult?.likelyMatch ?? null,
        mismatchReason: toolResult?.mismatchReason ?? null,
        queryFoodText: args?.queryFoodText || undefined,
      },
    });
  }

  if (toolName === "ask_calories") {
    return patchConversationState(conversationId, {
      last_calorie_estimate: {
        queryFoodText: toolResult?.queryFoodText || args?.queryFoodText || undefined,
        estimatedCalories: toolResult?.estimatedCalories ?? null,
        portionAssumption: toolResult?.portionAssumption ?? null,
        confidence: toolResult?.confidence ?? null,
        inMenu: toolResult?.inMenu ?? null,
        matchedMenuItem: toolResult?.matchedMenuItem || undefined,
        outsideMenu: toolResult?.outsideMenu ?? false,
      },
    });
  }

  if (toolName === "get_workout_programs") {
    const summaries = Array.isArray(toolResult?.summaries)
      ? toolResult.summaries
      : Array.isArray(toolResult?.data)
      ? toolResult.data.map((program) => ({
          id: program.id,
          name: program.name,
        }))
      : [];

    return patchConversationState(conversationId, {
      last_workout_context: {
        ...((await getConversationState(conversationId)).last_workout_context || {}),
        availablePrograms: summaries.map((program) => ({
          id: program.id,
          name: program.name,
        })),
      },
    });
  }

  if (toolName === "get_workout_context") {
    return patchConversationState(conversationId, {
      last_workout_context: {
        programId: toolResult?.currentProgram?.id || undefined,
        programName: toolResult?.currentProgram?.name || undefined,
        workoutDay: toolResult?.workoutDay ?? null,
        completionStatus: toolResult?.completionStatus || "UNKNOWN",
        exerciseCount: Array.isArray(toolResult?.exerciseList)
          ? toolResult.exerciseList.length
          : 0,
        expectedExercises: Array.isArray(toolResult?.exerciseList)
          ? toolResult.exerciseList.map((exercise) => exercise.exerciseName).filter(Boolean)
          : [],
      },
    });
  }

  if (toolName === "set_day_type") {
    if (toolResult?.error || toolResult?.success === false) {
      return getConversationState(conversationId);
    }
    const nextDayType = args?.dayType || toolResult?.data?.dayType || toolResult?.dayType || null;
    return rememberResolvedDayType(conversationId, nextDayType, "SET_DAY_TYPE");
  }

  if (toolName === "report_meal") {
    return patchConversationState(conversationId, {
      pending_meal_candidate: null,
      awaiting_missing_fields: null,
      awaiting_day_type: false,
    });
  }

  if (toolName === "update_meal") {
    return patchConversationState(conversationId, {
      pending_meal_update: null,
      awaiting_missing_fields: null,
    });
  }

  if (toolName === "report_workout") {
    return patchConversationState(conversationId, {
      pending_workout_candidate: null,
      awaiting_missing_fields: null,
    });
  }

  if (toolName === "update_workout" || toolName === "update_workout_exercise") {
    return patchConversationState(conversationId, {
      pending_workout_update: null,
      awaiting_missing_fields: null,
    });
  }

  return getConversationState(conversationId);
}

export async function updateStateAfterFinalText({ conversationId, text, hasDayType }) {
  const trimmed = (text || "").trim();
  if (!trimmed) return;

  const asksDayType =
    /יום העמסה|יום ללא העמסה|העמסה או יום ללא העמסה|העמסה או ללא העמסה|באיזה יום אתה/.test(
      trimmed
    );
  if (asksDayType && !hasDayType) {
    await patchConversationState(conversationId, {
      awaiting_day_type: true,
    });
  }
}
