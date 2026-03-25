import { McpResultDto } from "../../dtos/mcpResult.dto.js";
import { logger } from "../../utils/logger.js";
import { executeTool } from "../../llm/toolExecutor.js";
import { toolRegistry } from "../llm/tools/registry.js";
import {
  patchConversationState,
  updateConversationStateByTool,
} from "../state/conversationState.service.js";
import {
  extractDayTypeFromText,
  rememberResolvedDayType,
  syncDailyStateContext,
} from "../state/dayType.service.js";
import {
  formatWorkoutProgramsReply,
  resolveProgramSelectionFromText,
} from "../policies/workout.policy.js";

export async function executePendingAction({
  pendingAction,
  context,
  usedTools,
  conversationId,
}) {
  const { toolName } = pendingAction;
  const args = { ...pendingAction.payload };

  if (toolName === "report_meal") {
    const resolvedDayType =
      args.dayType ||
      context?.dailyState?.dayType ||
      context?.conversationState?.resolved_day_type?.dayType;
    if (!resolvedDayType) {
      await patchConversationState(conversationId, {
        awaiting_day_type: true,
      });
      return McpResultDto.parse({
        decision: "AUTO_REPLY",
        replyText: "מעולה. רק לפני הדיווח, אתה ביום העמסה או יום ללא העמסה היום?",
        usedTools,
      });
    }
    args.dayType = resolvedDayType;
  }

  const toolResult = await executeTool({
    toolName,
    args,
    context,
    toolRegistry,
  });

  usedTools.push(toolName);

  if (toolResult?.error) {
    logger.warn("Pending action execution failed; escalating to coach", {
      conversationId,
      toolName,
      error: toolResult.error,
    });
    return McpResultDto.parse({
      decision: "COACH_REPLY",
      replyText: null,
      usedTools,
    });
  }

  await updateConversationStateByTool({
    conversationId,
    toolName,
    args,
    toolResult,
  });

  return McpResultDto.parse({
    decision: "AUTO_REPLY",
    replyText: pendingAction.successText,
    usedTools,
  });
}

export async function applyDayTypeFromShortReply({
  userText,
  context,
  usedTools,
  conversationId,
}) {
  const extractedDayType = extractDayTypeFromText(userText);
  if (!extractedDayType) return null;

  const toolResult = await executeTool({
    toolName: "set_day_type",
    args: {
      dayType: extractedDayType,
      source: "USER_EXPLICIT",
      confidence: 1,
    },
    context,
    toolRegistry,
  });

  usedTools.push("set_day_type");

  if (toolResult?.error) {
    if (
      toolResult?.recoverable &&
      toolResult?.code === "DAY_TYPE_WEEKLY_LIMIT_REACHED"
    ) {
      return McpResultDto.parse({
        decision: "AUTO_REPLY",
        replyText:
          toolResult?.userMessage ||
          "אי אפשר להגדיר את סוג היום שביקשת כי המכסה השבועית כבר נוצלה.",
        usedTools,
      });
    }

    return McpResultDto.parse({
      decision: "COACH_REPLY",
      replyText: null,
      usedTools,
    });
  }

  syncDailyStateContext({
    toolName: "set_day_type",
    toolResult,
    args: { dayType: extractedDayType },
    context,
  });

  await updateConversationStateByTool({
    conversationId,
    toolName: "set_day_type",
    args: { dayType: extractedDayType },
    toolResult,
  });
  const resolvedDayType =
    toolResult?.data?.dayType || toolResult?.dayType || extractedDayType;
  context.conversationState = await rememberResolvedDayType(
    conversationId,
    resolvedDayType,
    "USER_TEXT"
  );

  return null;
}

export async function startWorkoutReportCollection({
  context,
  usedTools,
  conversationId,
}) {
  const programsResult = await executeTool({
    toolName: "get_workout_programs",
    args: {},
    context,
    toolRegistry,
  });
  usedTools.push("get_workout_programs");

  if (programsResult?.error) {
    return McpResultDto.parse({
      decision: "COACH_REPLY",
      replyText: null,
      usedTools,
    });
  }

  const summaries = Array.isArray(programsResult?.summaries)
    ? programsResult.summaries
    : Array.isArray(programsResult?.data)
    ? programsResult.data.map((program) => ({
        id: program.id,
        name: program.name,
      }))
    : [];

  if (summaries.length === 0) {
    return McpResultDto.parse({
      decision: "AUTO_REPLY",
      replyText:
        "כרגע אין לי תוכנית אימון פעילה אצלך במערכת. תרצה שאסמן את זה למאמן שיעדכן לך תוכנית?",
      usedTools,
    });
  }

  context.conversationState = await patchConversationState(conversationId, {
    awaiting_missing_fields: {
      actionType: "report_workout",
      missingFields: ["workoutType", "effortLevel", "notes", "exerciseWeights"],
      draftPayload: {},
    },
    last_workout_context: {
      availablePrograms: summaries.map((s) => ({
        id: s.id,
        name: s.name,
      })),
      completionStatus: "UNKNOWN",
      exerciseCount: 0,
    },
  });

  return McpResultDto.parse({
    decision: "AUTO_REPLY",
    replyText: formatWorkoutProgramsReply(summaries),
    usedTools,
  });
}

export async function maybeHandleWorkoutProgramSelection({
  userText,
  context,
  usedTools,
  conversationId,
}) {
  const awaiting = context?.conversationState?.awaiting_missing_fields;
  if (
    !awaiting ||
    awaiting.actionType !== "report_workout" ||
    !awaiting.missingFields?.includes("workoutType")
  ) {
    return null;
  }

  const programs = context?.conversationState?.last_workout_context?.availablePrograms || [];
  if (!Array.isArray(programs) || programs.length === 0) return null;

  const selectedProgram = resolveProgramSelectionFromText(userText, programs);
  if (!selectedProgram) return null;

  const workoutContextResult = await executeTool({
    toolName: "get_workout_context",
    args: { programId: selectedProgram.id },
    context,
    toolRegistry,
  });
  usedTools.push("get_workout_context");

  if (workoutContextResult?.error) {
    return McpResultDto.parse({
      decision: "COACH_REPLY",
      replyText: null,
      usedTools,
    });
  }

  const expectedExercises = (workoutContextResult?.exerciseList || [])
    .map((exercise) => exercise.exerciseName)
    .filter(Boolean);

  const draftPayload = {
    workoutType: selectedProgram.name,
    exercises: expectedExercises.map((exerciseName) => ({
      exerciseName,
    })),
  };

  context.conversationState = await patchConversationState(conversationId, {
    awaiting_missing_fields: {
      actionType: "report_workout",
      missingFields: ["effortLevel", "notes", "exerciseWeights"],
      draftPayload,
    },
    pending_workout_candidate: null,
    last_workout_context: {
      ...(context.conversationState?.last_workout_context || {}),
      programId: selectedProgram.id,
      programName: selectedProgram.name,
      workoutDay: selectedProgram.name,
      completionStatus: "NOT_REPORTED",
      exerciseCount: expectedExercises.length,
      expectedExercises,
      availablePrograms: programs,
    },
  });

  const exerciseLines =
    expectedExercises.length > 0
      ? expectedExercises.map((name, index) => `${index + 1}. ${name}`).join("\n")
      : "לא מצאתי תרגילים בתוכנית, תכתוב את התרגילים שביצעת ומשקל לכל תרגיל.";

  const replyText = [
    `מעולה, בחרת באימון ${selectedProgram.name}.`,
    "כדי לדווח במדויק תשלח לי עכשיו:",
    "- רמת מאמץ (EASY / NORMAL / HARD / FAILED / SKIPPED)",
    '- הערות (אם אין אפשר לכתוב "אין")',
    "- משקל לכל תרגיל שביצעת:",
    exerciseLines,
  ].join("\n");

  return McpResultDto.parse({
    decision: "AUTO_REPLY",
    replyText,
    usedTools,
  });
}
