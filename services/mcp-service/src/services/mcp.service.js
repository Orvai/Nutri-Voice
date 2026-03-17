import { RunMcpDto } from "../dtos/runMcp.dto.js";
import { McpResultDto } from "../dtos/mcpResult.dto.js";
import { runLLM } from "../llm/llmClient.js";
import { systemPrompt } from "../llm/systemPrompt.js";
import { llmTools } from "../llm/tools/llmTools.js";
import { toolRegistry } from "../llm/tools/registry.js";
import { executeTool } from "../llm/toolExecutor.js";
import { callGateway } from "../http/gatewayClient.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";
import {
  getConversationState,
  patchConversationState,
} from "../state/conversationState.store.js";

const SHORT_CONFIRMATION_RE =
  /^(כן+|יאללה|סבבה|אשר|מאשר|אישור|תדווח(?:י)?|תעדכן(?:י)?|יאללה תדווח|כן תדווח|כן תעדכן)(\s|$|[.!?,])?/i;

function toMcpDecision(content, usedTools) {
  const text = (content || "").trim();

  if (!text) {
    return McpResultDto.parse({
      decision: "COACH_REPLY",
      replyText: null,
      usedTools,
    });
  }

  if (text.includes("COACH_REPLY")) {
    return McpResultDto.parse({
      decision: "COACH_REPLY",
      replyText: null,
      usedTools,
    });
  }

  return McpResultDto.parse({
    decision: "AUTO_REPLY",
    replyText: text,
    usedTools,
  });
}

function buildUserMessage({ userText, contentType, media }) {
  if (contentType === "IMAGE" && media?.mediaUrl) {
    const content = [];

    if (userText?.trim()) {
      content.push({
        type: "text",
        text: userText.trim(),
      });
    } else {
      content.push({
        type: "text",
        text: "המשתמש שלח תמונה. נתח את האוכל בתמונה והגב לפי הכללים.",
      });
    }

    content.push({
      type: "image_url",
      image_url: {
        url: media.mediaUrl,
      },
    });

    return {
      role: "user",
      content,
    };
  }

  if (contentType === "AUDIO") {
    return {
      role: "user",
      content: userText?.trim() || "המשתמש שלח הודעת קול ללא תמלול.",
    };
  }

  if ((contentType === "VIDEO" || contentType === "IMAGE") && media?.mediaUrl && !userText?.trim()) {
    return {
      role: "user",
      content: `[${contentType}] ${media.mediaUrl}`,
    };
  }

  return {
    role: "user",
    content: userText,
  };
}

function buildStateSystemMessage(state) {
  return {
    role: "system",
    content:
      "Conversation state (trusted runtime context, do not expose directly): " +
      JSON.stringify(state),
  };
}

function isShortConfirmation(text) {
  return SHORT_CONFIRMATION_RE.test((text || "").trim());
}

function extractDayTypeFromText(text) {
  const normalized = String(text || "").trim().toLowerCase();
  if (!normalized) return null;

  const isTraining =
    /יום\s*אימון|אימון|התאמנתי|עשיתי אימון|סיימתי אימון/.test(normalized);
  const isRest = /יום\s*מנוחה|מנוחה|נחתי|יום מנוחה/.test(normalized);

  if (isTraining && !isRest) return "TRAINING";
  if (isRest && !isTraining) return "REST";
  return null;
}

function isSmallTalk(text) {
  return /^(היי|הי|שלום|בוקר טוב|ערב טוב|לילה טוב|מה קורה|מה נשמע)\b/i.test(
    String(text || "").trim()
  );
}

function isInDomain(text) {
  return /תזונה|קלור|ארוחה|תפריט|חלבון|פחמ|שומן|אכל|אימון|מתאמן|תרגיל|סטים|חזרות|משקל|כושר|צעדים|מים|שינה|מנוחה|חיטוב|מסה|workout|nutrition/i.test(
    String(text || "")
  );
}

function isOutOfScopeMessage(text) {
  const normalized = String(text || "").trim();
  if (!normalized) return false;
  if (isSmallTalk(normalized)) return false;
  if (isInDomain(normalized)) return false;

  const looksLikeQuestion =
    /[?？]/.test(normalized) ||
    /^(מה|מי|איפה|מתי|למה|איך|כמה|אפשר|תסביר|תספר|איזה|what|who|when|where|why|how)\b/i.test(
      normalized
    );

  return looksLikeQuestion;
}

function detectCoachCriticalMessage(text) {
  const normalized = String(text || "").trim().toLowerCase();
  if (!normalized) return { isCritical: false, mentionsMedical: false };

  const distress =
    /קשה לי|נשברתי|אין לי כוח|לא מצליח|לא מצליחה|ויתרתי|מתוסכל|מיואש|אני לא עומד בזה/.test(
      normalized
    );
  const medical =
    /כאב|כאבים|סחרחורת|בחילה|הקאה|התעלפתי|פציעה|דימום|לחץ בחזה|חרדה|דיכאון|בולמוס|הפרעת אכילה/.test(
      normalized
    );

  return {
    isCritical: distress || medical,
    mentionsMedical: medical,
  };
}

function buildCoachSuggestedReply({ mentionsMedical }) {
  if (mentionsMedical) {
    return "תודה ששיתפת, זה חשוב. אני ממליץ שנעצור רגע ושהמאמן יחזור אליך אישית כדי לתת מענה בטוח ומדויק.";
  }
  return "אני איתך, תודה ששיתפת. המאמן שלך יחזור אליך אישית עם מענה מותאם, ובינתיים אפשר ללכת על צעד קטן וקל להמשך.";
}

function isWorkoutReportStart(text) {
  return /(אני\s+)?(רוצה|מעוניי?ן|בא לי)\s+לדווח\s+על\s+אימון|לדווח על אימון|דיווח אימון/i.test(
    String(text || "").trim()
  );
}

function normalizeToken(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^\u0590-\u05FFa-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ");
}

function resolveProgramSelectionFromText(userText, programs = []) {
  const text = String(userText || "").trim();
  if (!text) return null;

  const asNumber = Number.parseInt(text, 10);
  if (Number.isInteger(asNumber) && asNumber >= 1 && asNumber <= programs.length) {
    return programs[asNumber - 1];
  }

  const normalizedText = normalizeToken(text);
  return (
    programs.find((program) => normalizeToken(program.name) === normalizedText) ||
    programs.find((program) => normalizedText.includes(normalizeToken(program.name))) ||
    null
  );
}

function formatWorkoutProgramsReply(programs = []) {
  const lines = programs.map((program, index) => `${index + 1}. ${program.name}`);
  return [
    "מעולה, איזה אימון מהתוכניות שלך ביצעת?",
    ...lines,
    "אחרי שתבחר, נאסוף רמת מאמץ, הערות, ומשקל לכל תרגיל שביצעת ואז אדווח את האימון.",
  ].join("\n");
}

function mergeWorkoutReportDraftArgs(args, state) {
  const awaiting = state?.awaiting_missing_fields;
  if (awaiting?.actionType !== "report_workout" || !awaiting?.draftPayload) {
    return args;
  }

  const draft = awaiting.draftPayload || {};
  const merged = {
    ...draft,
    ...args,
  };

  const draftExercises = Array.isArray(draft.exercises) ? draft.exercises : [];
  const argExercises = Array.isArray(args.exercises) ? args.exercises : [];

  if (draftExercises.length || argExercises.length) {
    const byName = new Map();

    for (const exercise of draftExercises) {
      const key = normalizeToken(exercise.exerciseName || exercise.id || "");
      if (!key) continue;
      byName.set(key, { ...exercise });
    }

    for (const exercise of argExercises) {
      const key = normalizeToken(exercise.exerciseName || exercise.id || "");
      if (!key) continue;
      const prev = byName.get(key) || {};
      byName.set(key, { ...prev, ...exercise });
    }

    merged.exercises = [...byName.values()];
  }

  return merged;
}

function validateWorkoutReportPayload(args) {
  const missing = [];
  if (!args?.workoutType) missing.push("workoutType");
  if (!args?.effortLevel) missing.push("effortLevel");
  if (typeof args?.notes !== "string") missing.push("notes");

  if (!Array.isArray(args?.exercises) || args.exercises.length === 0) {
    missing.push("exercises");
  } else {
    const missingWeights = args.exercises.filter(
      (exercise) => !Object.prototype.hasOwnProperty.call(exercise || {}, "weight")
    );
    if (missingWeights.length > 0) {
      missing.push("exerciseWeights");
    }
  }

  if (missing.length === 0) {
    return { ok: true };
  }

  return {
    ok: false,
    missingFields: [...new Set(missing)],
    message:
      "לפני הדיווח חסר לי מידע: רמת מאמץ, הערות, ומשקל לכל תרגיל שביצעת.",
  };
}

function toLocalDateKey(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function rememberResolvedDayType(conversationId, dayType, source) {
  if (!dayType) return getConversationState(conversationId);
  return patchConversationState(conversationId, {
    awaiting_day_type: false,
    resolved_day_type: {
      dayType,
      source,
      capturedAt: new Date().toISOString(),
    },
  });
}

function hydrateDayTypeFromState(context) {
  if (context?.dailyState?.dayType) return false;

  const resolved = context?.conversationState?.resolved_day_type;
  if (!resolved?.dayType || !resolved?.capturedAt) return false;

  const resolvedDateKey = toLocalDateKey(resolved.capturedAt);
  const todayDateKey = toLocalDateKey();
  if (!resolvedDateKey || !todayDateKey || resolvedDateKey !== todayDateKey) {
    return false;
  }

  context.dailyState = {
    ...(context.dailyState || {}),
    dayType: resolved.dayType,
  };
  return true;
}

function syncDailyStateContext({ toolName, toolResult, args, context }) {
  if (toolName === "get_daily_state") {
    context.dailyState = toolResult?.data ?? toolResult;
    return;
  }

  if (toolName === "set_day_type") {
    const nextDayType =
      args?.dayType ||
      toolResult?.data?.dayType ||
      toolResult?.dayType;

    if (nextDayType) {
      context.dailyState = {
        ...(context.dailyState || {}),
        dayType: nextDayType,
      };
    }
  }
}

function pickPendingAction(state) {
  if (state.pending_meal_candidate) {
    return {
      stateKey: "pending_meal_candidate",
      toolName: "report_meal",
      payload: state.pending_meal_candidate,
      successText: "מעולה, דיווחתי את הארוחה.",
    };
  }

  if (state.pending_meal_update) {
    return {
      stateKey: "pending_meal_update",
      toolName: "update_meal",
      payload: state.pending_meal_update,
      successText: "סגור, עדכנתי את הארוחה.",
    };
  }

  if (state.pending_workout_candidate) {
    return {
      stateKey: "pending_workout_candidate",
      toolName: "report_workout",
      payload: state.pending_workout_candidate,
      successText: "מעולה, האימון דווח.",
    };
  }

  if (state.pending_workout_update) {
    return {
      stateKey: "pending_workout_update",
      toolName: state.pending_workout_update.toolName,
      payload: state.pending_workout_update.payload,
      successText: "סגור, עדכנתי את האימון.",
    };
  }

  return null;
}

function updateConversationStateByTool({ conversationId, toolName, args, toolResult }) {
  if (toolName === "get_daily_state" && toolResult?.dayType) {
    return rememberResolvedDayType(
      conversationId,
      toolResult.dayType,
      "TOOL_DAILY_STATE"
    );
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
        ...(getConversationState(conversationId).last_workout_context || {}),
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
          ? toolResult.exerciseList
              .map((exercise) => exercise.exerciseName)
              .filter(Boolean)
          : [],
      },
    });
  }

  if (toolName === "set_day_type") {
    const nextDayType =
      args?.dayType ||
      toolResult?.data?.dayType ||
      toolResult?.dayType ||
      null;
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

async function executePendingAction({
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
      patchConversationState(conversationId, {
        awaiting_day_type: true,
      });
      return McpResultDto.parse({
        decision: "AUTO_REPLY",
        replyText: "מעולה. רק לפני הדיווח, אתה ביום אימון או מנוחה היום?",
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

  updateConversationStateByTool({
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

async function applyDayTypeFromShortReply({
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

  updateConversationStateByTool({
    conversationId,
    toolName: "set_day_type",
    args: { dayType: extractedDayType },
    toolResult,
  });
  context.conversationState = rememberResolvedDayType(
    conversationId,
    extractedDayType,
    "USER_TEXT"
  );

  return null;
}

async function startWorkoutReportCollection({
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

  context.conversationState = patchConversationState(conversationId, {
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

async function maybeHandleWorkoutProgramSelection({
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

  context.conversationState = patchConversationState(conversationId, {
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

function updateStateAfterFinalText({ conversationId, text, hasDayType }) {
  const trimmed = (text || "").trim();
  if (!trimmed) return;

  const asksDayType =
    /יום אימון|יום מנוחה|אימון או מנוחה|באיזה יום אתה/.test(trimmed);
  if (asksDayType && !hasDayType) {
    patchConversationState(conversationId, {
      awaiting_day_type: true,
    });
  }
}

export async function runMcp(input) {
  const {
    conversationId,
    messageId,
    sender,
    clientId,
    userId,
    contentType,
    media,
    userText,
    history,
  } = RunMcpDto.parse(input);

  const context = {
    conversationId,
    messageId,
    sender,
    clientId,
    userId: sender === "coach" ? userId : clientId,
    dailyState: undefined,
    conversationState: getConversationState(conversationId),
  };

  const usedTools = [];
  const toolErrors = [];

  const messages = [
    ...history,
    buildStateSystemMessage(context.conversationState),
    buildUserMessage({ userText, contentType, media }),
  ];

  try {
    const dailyStateRes = await callGateway({
      contractKey: "DAILY_STATE_GET",
      sender,
      context,
    });
    context.dailyState = dailyStateRes?.data ?? dailyStateRes;

    if (context.dailyState?.dayType) {
      context.conversationState = rememberResolvedDayType(
        conversationId,
        context.dailyState.dayType,
        "TOOL_DAILY_STATE"
      );
    } else if (hydrateDayTypeFromState(context)) {
      context.conversationState = patchConversationState(conversationId, {
        awaiting_day_type: false,
      });
    }

    messages[history.length] = buildStateSystemMessage(context.conversationState);

    if (context.conversationState?.awaiting_day_type) {
      const maybeHandled = await applyDayTypeFromShortReply({
        userText,
        context,
        usedTools,
        conversationId,
      });

      if (maybeHandled) return maybeHandled;
    }

    const criticalSignal = detectCoachCriticalMessage(userText);
    if (criticalSignal.isCritical) {
      await executeTool({
        toolName: "should_coach_reply",
        args: {
          userMessage: userText,
          mentionsMedical: criticalSignal.mentionsMedical,
          hasUncertainty: true,
        },
        context,
        toolRegistry,
      });
      usedTools.push("should_coach_reply");

      return McpResultDto.parse({
        decision: "COACH_REPLY",
        replyText: null,
        coachSuggestedReply: buildCoachSuggestedReply(criticalSignal),
        usedTools,
      });
    }

    if (isOutOfScopeMessage(userText)) {
      return McpResultDto.parse({
        decision: "AUTO_REPLY",
        replyText:
          "איני יכול לענות לך על זה. אני כאן כדי לעזור רק בנושאי כושר, אימונים ותזונה.",
        usedTools,
      });
    }

    const workoutSelectionResult = await maybeHandleWorkoutProgramSelection({
      userText,
      context,
      usedTools,
      conversationId,
    });
    if (workoutSelectionResult) {
      return workoutSelectionResult;
    }

    const awaitingState = context.conversationState?.awaiting_missing_fields;
    if (
      isWorkoutReportStart(userText) &&
      (!awaitingState || awaitingState.actionType !== "report_workout")
    ) {
      return startWorkoutReportCollection({
        context,
        usedTools,
        conversationId,
      });
    }

    const pendingAction = pickPendingAction(getConversationState(conversationId));
    if (isShortConfirmation(userText) && pendingAction) {
      return executePendingAction({
        pendingAction,
        context,
        usedTools,
        conversationId,
      });
    }

    for (let step = 0; step < env.MCP_MAX_TOOL_STEPS; step += 1) {
      const llmMessage = await runLLM({
        systemPrompt,
        messages,
        tools: llmTools,
      });

      if (!llmMessage.tool_calls?.length) {
        const decision = toMcpDecision(llmMessage.content, usedTools);
        if (decision.replyText) {
          updateStateAfterFinalText({
            conversationId,
            text: decision.replyText,
            hasDayType: !!context.dailyState?.dayType,
          });
        }
        return decision;
      }

      messages.push(llmMessage);

      for (const call of llmMessage.tool_calls) {
        const toolName = call.function.name;
        let args = {};
        let toolResult;

        try {
          args = JSON.parse(call.function.arguments || "{}");
        } catch (e) {
          logger.error("Failed to parse tool args", {
            toolName,
            error: e.message,
          });
          toolResult = { error: `Invalid JSON arguments for tool ${toolName}` };
        }

        if (!toolResult && toolName === "report_workout") {
          args = mergeWorkoutReportDraftArgs(args, context.conversationState);
          const validation = validateWorkoutReportPayload(args);
          if (!validation.ok) {
            context.conversationState = patchConversationState(conversationId, {
              awaiting_missing_fields: {
                actionType: "report_workout",
                missingFields: validation.missingFields,
                draftPayload: args,
              },
            });

            toolResult = {
              error: validation.message,
              recoverable: true,
              missingFields: validation.missingFields,
              expectedExercises:
                context.conversationState?.last_workout_context?.expectedExercises || [],
            };
          }
        }

        if (!toolResult) {
          logger.info("Executing MCP tool", {
            toolName,
            clientId,
            step: step + 1,
          });

          toolResult = await executeTool({
            toolName,
            args,
            context,
            toolRegistry,
          });
        }

        syncDailyStateContext({ toolName, toolResult, args, context });
        context.conversationState = updateConversationStateByTool({
          conversationId,
          toolName,
          args,
          toolResult,
        });

        if (toolName === "should_coach_reply" && toolResult?.decision === "COACH_REPLY") {
          usedTools.push(toolName);
          return McpResultDto.parse({
            decision: "COACH_REPLY",
            replyText: null,
            usedTools,
          });
        }

        if (toolResult?.error && !toolResult?.recoverable) {
          toolErrors.push({
            toolName,
            error: toolResult.error,
          });
        }

        usedTools.push(toolName);

        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(toolResult),
        });
      }

      if (toolErrors.length > 0) {
        logger.warn("MCP tool execution failed; escalating to coach", {
          clientId,
          toolErrors,
        });
        return McpResultDto.parse({
          decision: "COACH_REPLY",
          replyText: null,
          usedTools,
        });
      }
    }

    logger.warn("MCP reached tool-call step limit; escalating to coach", {
      clientId,
      maxSteps: env.MCP_MAX_TOOL_STEPS,
      usedTools,
    });
    return McpResultDto.parse({
      decision: "COACH_REPLY",
      replyText: null,
      usedTools,
    });
  } catch (error) {
    logger.error("MCP critical error", {
      error: error.message,
      clientId,
      conversationId,
      messageId,
    });
    return McpResultDto.parse({
      decision: "COACH_REPLY",
      replyText: null,
      usedTools,
    });
  }
}
