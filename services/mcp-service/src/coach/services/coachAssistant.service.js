import { RunCoachMcpDto } from "../../dtos/runCoachMcp.dto.js";
import { CoachMcpResultDto } from "../../dtos/coachResult.dto.js";
import { coachSystemPrompt } from "../llm/coachSystemPrompt.js";
import { coachToolRegistry } from "../llm/tools/registry.js";
import {
  getCoachSessionState,
  patchCoachSessionState,
} from "../state/coachSession.store.js";

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^\u0590-\u05FFa-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ");
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function isOutOfScopeMessage(text) {
  const normalized = normalizeText(text);
  if (!normalized) return false;

  const inDomain =
    /client|coach|status|daily|progress|menu|nutrition|workout|program|exercise|conversation|message|tracking|תזונה|תפריט|אימון|אימונים|שיחה|הודעה|לקוח|התקדמות|סטטוס/.test(
      normalized
    );

  if (inDomain) return false;
  return /^(what|who|when|where|why|how|tell|explain|מי|מה|מתי|איפה|למה|איך)\b/.test(
    normalized
  );
}

function detectEscalation(text, metadata = {}) {
  if (metadata?.forceEscalation) {
    return {
      shouldEscalate: true,
      reason: "manual_escalation_requested",
      recommendedNextStep: "יש להסלים את הבקשה לטיפול ידני של מאמן/אדמין.",
    };
  }

  const normalized = normalizeText(text);
  if (
    /medical|legal|billing|payment|compliance|privacy|danger|safety|urgent|רפואי|משפטי|חיוב|תשלום|דחוף|סיכון/.test(
      normalized
    )
  ) {
    return {
      shouldEscalate: true,
      reason: "high_risk_or_privileged_request",
      recommendedNextStep: "יש להסלים את הבקשה לטיפול ידני של מאמן/אדמין.",
    };
  }

  return { shouldEscalate: false };
}

function inferIntent(input) {
  const explicitIntent = input.metadata?.intent;
  if (explicitIntent) return explicitIntent;

  const text = normalizeText(input.userText);
  const menuSelectionMatch = text.match(/^(?:אפשרות\s*)?([1-7])$/);
  if (menuSelectionMatch) {
    const option = menuSelectionMatch[1];
    if (option === "1") return "client_overview";
    if (option === "2") return "client_week_progress";
    if (option === "3") return "nutrition_overview";
    if (option === "4") return "workout_overview";
    if (option === "5") return "clients_overview";
    if (option === "6") return "send_message";
    if (option === "7") return "mark_message_handled";
  }

  if (
    /clients|client list|all clients|לקוחות|רשימת לקוחות|הלקוחות/.test(text)
  ) {
    return "clients_overview";
  }

  if (
    /((clients|לקוחות).*(risk|at risk|alert|alerts|warning|warnings|בסיכון|סיכון|התראה|התראות))|((risk|at risk|alert|alerts|warning|warnings|בסיכון|סיכון|התראה|התראות).*(clients|לקוחות))/.test(
      text
    )
  ) {
    return "clients_overview";
  }

  if (
    /risk|at risk|alert|alerts|warning|warnings|בסיכון|סיכון|התראה|התראות/.test(
      text
    )
  ) {
    return "client_week_progress";
  }

  if (
    /weekly report|week report|weekly summary|weekly|summary|summarize|report|reports|דוח|דוחות|סיכום|סכם/.test(
      text
    )
  ) {
    if (/clients|לקוחות|all/.test(text)) {
      return "clients_overview";
    }
    return "client_week_progress";
  }

  if (/status|overview|progress|סטטוס|מצב|סקיר(?:ה|ת)|התקדמות/.test(text)) {
    return "client_overview";
  }
  if (/last week|weekly|שבוע/.test(text)) return "client_week_progress";
  if (/send message|שלח הודעה|הודעה ל/.test(text)) return "send_message";
  if (/mark handled|סמן טופל|handled/.test(text)) return "mark_message_handled";
  if (/update workout|עדכן אימון|update program|עדכן תוכנית/.test(text)) {
    return "workout_update_program";
  }
  if (/log workout|דווח אימון|רשום אימון/.test(text)) return "workout_log";
  if (/conversation|שיחה|הודעות/.test(text)) return "conversation_overview";
  if (/nutrition|menu|תפריט|תזונה/.test(text)) return "nutrition_overview";
  if (/workout|program|אימון|תוכנית אימון/.test(text)) return "workout_overview";

  return "unknown";
}

function requiresClient(intent) {
  return new Set([
    "client_overview",
    "client_week_progress",
    "workout_update_program",
    "workout_log",
    "conversation_overview",
    "nutrition_overview",
    "workout_overview",
    "send_message",
  ]).has(intent);
}

function findClientMatches(clients, userText) {
  const normalizedText = normalizeText(userText);
  if (!normalizedText) return [];

  return clients.filter((client) => {
    const idToken = normalizeText(client?.id || "");
    const nameToken = normalizeText(client?.name || "");
    if (idToken && normalizedText.includes(idToken)) return true;
    if (nameToken && normalizedText.includes(nameToken)) return true;
    return false;
  });
}

async function executeAndTrack({ toolName, args = {}, context, usedTools, toolResults }) {
  const tool = coachToolRegistry[toolName];
  if (!tool) {
    throw new Error(`Unknown coach tool: ${toolName}`);
  }
  const result = await tool.execute(args, context);
  usedTools.push(toolName);
  toolResults.push(result);
  return result;
}

function buildToolFailureResult(context, toolName, error) {
  return {
    ok: false,
    entityType: "tool_error",
    entityId: null,
    summary: `כשל בהפעלת הכלי ${toolName}.`,
    data: null,
    meta: {
      toolName,
      message: error?.message || "Tool execution failed",
    },
    audit: {
      requestId: context?.audit?.requestId || null,
      actorId: context?.audit?.actorId || context?.userId || null,
      clientId: context?.clientId || context?.audit?.clientId || null,
      toolName,
    },
  };
}

async function safeExecuteAndTrack({
  toolName,
  args = {},
  context,
  usedTools,
  toolResults,
}) {
  try {
    return await executeAndTrack({ toolName, args, context, usedTools, toolResults });
  } catch (error) {
    toolResults.push(buildToolFailureResult(context, toolName, error));
    return null;
  }
}

async function collectClientSnapshot({
  inputMetadata = {},
  context,
  usedTools,
  toolResults,
}) {
  if (!context?.clientId) return null;

  const endDate = inputMetadata?.endDate || formatDate(new Date());
  const start = new Date();
  start.setDate(start.getDate() - 6);
  const startDate = inputMetadata?.startDate || formatDate(start);

  const dailyState = await safeExecuteAndTrack({
    toolName: "coach_get_daily_state",
    args: { clientId: context.clientId },
    context,
    usedTools,
    toolResults,
  });

  const dailyStateRange = await safeExecuteAndTrack({
    toolName: "coach_get_daily_state_range",
    args: { clientId: context.clientId, startDate, endDate },
    context,
    usedTools,
    toolResults,
  });

  const menus = await safeExecuteAndTrack({
    toolName: "nutrition_list_client_menus",
    args: { clientId: context.clientId },
    context,
    usedTools,
    toolResults,
  });

  const programs = await safeExecuteAndTrack({
    toolName: "workout_list_client_programs",
    args: { clientId: context.clientId },
    context,
    usedTools,
    toolResults,
  });

  const conversations = await safeExecuteAndTrack({
    toolName: "coach_list_conversations",
    context,
    usedTools,
    toolResults,
  });

  const allConversations = Array.isArray(conversations?.data) ? conversations.data : [];
  const clientConversations = allConversations.filter(
    (conversation) =>
      conversation?.clientId === context.clientId ||
      conversation?.client?.id === context.clientId
  );

  return {
    startDate,
    endDate,
    dailyState,
    dailyStateRange,
    menus,
    programs,
    allConversations,
    clientConversations,
  };
}

function buildResult({
  status,
  summary,
  replyText = null,
  resolvedClient = null,
  toolResults = [],
  usedTools = [],
  meta = {},
  audit = {},
}) {
  const promptProfile = "coach_system_prompt_v1";
  const promptLoaded = Boolean(coachSystemPrompt && coachSystemPrompt.length > 0);
  return CoachMcpResultDto.parse({
    status,
    summary,
    replyText,
    resolvedClient,
    toolResults,
    usedTools,
    meta: {
      promptProfile,
      promptLoaded,
      ...meta,
    },
    audit,
  });
}

export async function runCoachMcp(rawInput) {
  const input = RunCoachMcpDto.parse(rawInput);
  const usedTools = [];
  const toolResults = [];

  const context = {
    conversationId: input.conversationId,
    messageId: input.messageId,
    sender: "coach",
    userId: input.userId,
    clientId: input.clientId || null,
    audit: {
      requestId: input.requestAudit?.requestId || null,
      actorId: input.requestAudit?.actorId || input.userId,
      clientId: input.requestAudit?.clientId || input.clientId || null,
      toolName: null,
    },
  };

  const escalationSignal = detectEscalation(input.userText, input.metadata);
  if (escalationSignal.shouldEscalate) {
    return buildResult({
      status: "escalation_required",
      summary: "נדרשת הסלמה לטיפול ידני.",
      replyText: "כדי לטפל בבקשה הזו צריך הסלמה לטיפול ידני של מאמן/אדמין.",
      meta: {
        reason: escalationSignal.reason,
        recommendedNextStep: escalationSignal.recommendedNextStep,
      },
      audit: context.audit,
    });
  }

  if (isOutOfScopeMessage(input.userText)) {
    return buildResult({
      status: "out_of_scope",
      summary: "הבקשה מחוץ לתחום העוזר.",
      replyText: "העוזר מטפל רק בפעולות מאמן: לקוחות, תזונה, אימונים ושיחות.",
      meta: {
        reason: "unsupported_scope",
      },
      audit: context.audit,
    });
  }

  const intent = inferIntent(input);
  let sessionState = await getCoachSessionState(input.conversationId);
  let resolvedClient = null;

  if (context.clientId) {
    resolvedClient = { id: context.clientId, name: null };
  } else if (sessionState?.activeClient?.id) {
    resolvedClient = {
      id: sessionState.activeClient.id,
      name: sessionState.activeClient.name || null,
    };
    context.clientId = resolvedClient.id;
  }

  if (!resolvedClient && requiresClient(intent)) {
    const listResult = await executeAndTrack({
      toolName: "coach_list_clients",
      context,
      usedTools,
      toolResults,
    });

    const clients = Array.isArray(listResult?.data) ? listResult.data : [];
    const matches = findClientMatches(clients, input.userText);

    if (matches.length === 1) {
      resolvedClient = {
        id: matches[0].id,
        name: matches[0].name || null,
      };
      context.clientId = resolvedClient.id;
      context.audit.clientId = resolvedClient.id;
      sessionState = await patchCoachSessionState(input.conversationId, {
        activeClient: resolvedClient,
        pendingClarification: null,
      });
    } else if (matches.length > 1) {
      await patchCoachSessionState(input.conversationId, {
        pendingClarification: {
          type: "client_selection",
          options: matches.map((client) => ({
            id: client.id,
            name: client.name || client.id,
          })),
        },
      });

      return buildResult({
        status: "clarification_required",
        summary: "נמצאו כמה לקוחות תואמים.",
        replyText: "מצאתי כמה לקוחות מתאימים. כתוב בבקשה את שם הלקוח המדויק.",
        toolResults,
        usedTools,
        meta: {
          reason: "ambiguous_client",
          options: matches.map((client) => ({
            id: client.id,
            name: client.name || client.id,
          })),
        },
        audit: context.audit,
      });
    } else {
      return buildResult({
        status: "clarification_required",
        summary: "לא הצלחתי לזהות לקוח.",
        replyText: "כדי להמשיך, כתוב שם לקוח או clientId.",
        toolResults,
        usedTools,
        meta: {
          reason: "client_resolution_failed",
        },
        audit: context.audit,
      });
    }
  }

  if (!resolvedClient && requiresClient(intent)) {
    return buildResult({
      status: "clarification_required",
      summary: "חסר הקשר לקוח.",
      replyText: "כתוב בבקשה על איזה לקוח לבצע את הפעולה.",
      toolResults,
      usedTools,
      meta: {
        reason: "missing_client_context",
      },
      audit: context.audit,
    });
  }

  if (resolvedClient && !sessionState?.activeClient?.id) {
    await patchCoachSessionState(input.conversationId, {
      activeClient: resolvedClient,
      pendingClarification: null,
    });
  }

  let clientSnapshot = null;
  if (context.clientId) {
    clientSnapshot = await collectClientSnapshot({
      inputMetadata: input.metadata || {},
      context,
      usedTools,
      toolResults,
    });
  }

  if (intent === "client_overview") {
    const dailyState =
      clientSnapshot?.dailyState ||
      (await safeExecuteAndTrack({
        toolName: "coach_get_daily_state",
        args: { clientId: context.clientId },
        context,
        usedTools,
        toolResults,
      }));

    const menus =
      clientSnapshot?.menus ||
      (await safeExecuteAndTrack({
        toolName: "nutrition_list_client_menus",
        args: { clientId: context.clientId },
        context,
        usedTools,
        toolResults,
      }));

    const programs =
      clientSnapshot?.programs ||
      (await safeExecuteAndTrack({
        toolName: "workout_list_client_programs",
        args: { clientId: context.clientId },
        context,
        usedTools,
        toolResults,
      }));

    const conversations = clientSnapshot?.clientConversations || [];
    const weeklyEntries = Array.isArray(clientSnapshot?.dailyStateRange?.data)
      ? clientSnapshot.dailyStateRange.data.length
      : 0;

    await patchCoachSessionState(input.conversationId, {
      activeClient: resolvedClient,
      pendingClarification: null,
      lastOverview: {
        clientId: context.clientId,
        generatedAt: new Date().toISOString(),
      },
    });

    const activeMenus = Array.isArray(menus?.data) ? menus.data.length : 0;
    const workoutPrograms = Array.isArray(programs?.data) ? programs.data.length : 0;
    const dayType = dailyState?.data?.dayType || "UNKNOWN";

    return buildResult({
      status: "ok",
      summary: `סיכום הלקוח ${resolvedClient?.name || context.clientId} מוכן.`,
      replyText: `לקוח ${resolvedClient?.name || context.clientId}: סוג יום ${dayType}, תפריטים ${activeMenus}, תוכניות אימון ${workoutPrograms}, שיחות ${conversations.length}, רשומות שבועיות ${weeklyEntries}.`,
      resolvedClient,
      toolResults,
      usedTools,
      meta: {
        dayType,
        menuCount: activeMenus,
        workoutProgramCount: workoutPrograms,
        conversationCount: conversations.length,
        weeklyEntryCount: weeklyEntries,
      },
      audit: context.audit,
    });
  }

  if (intent === "clients_overview") {
    const clients = await executeAndTrack({
      toolName: "coach_list_clients",
      context,
      usedTools,
      toolResults,
    });

    const data = Array.isArray(clients?.data) ? clients.data : [];
    const preview = data
      .slice(0, 5)
      .map((client) => client?.name || client?.id)
      .filter(Boolean)
      .join(", ");

    return buildResult({
      status: "ok",
      summary: "רשימת הלקוחות נשלפה.",
      replyText:
        data.length > 0
          ? `נמצאו ${data.length} לקוחות${preview ? `: ${preview}` : ""}.`
          : "לא נמצאו לקוחות למאמן הזה.",
      resolvedClient,
      toolResults,
      usedTools,
      meta: {
        count: data.length,
      },
      audit: context.audit,
    });
  }

  if (intent === "client_week_progress") {
    const endDate = input.metadata?.endDate || formatDate(new Date());
    const start = new Date();
    start.setDate(start.getDate() - 6);
    const startDate = input.metadata?.startDate || formatDate(start);

    const range =
      clientSnapshot?.dailyStateRange ||
      (await safeExecuteAndTrack({
        toolName: "coach_get_daily_state_range",
        args: {
          clientId: context.clientId,
          startDate,
          endDate,
        },
        context,
        usedTools,
        toolResults,
      }));

    const count = Array.isArray(range?.data) ? range.data.length : 0;
    return buildResult({
      status: "ok",
      summary: "התקדמות שבועית נשלפה.",
      replyText: `נמצאו ${count} רשומות יומיות בין ${startDate} ל-${endDate}.`,
      resolvedClient,
      toolResults,
      usedTools,
      meta: { startDate, endDate, count },
      audit: context.audit,
    });
  }

  if (intent === "workout_update_program") {
    const programId = input.metadata?.programId;
    const payload = input.metadata?.payload;
    if (!programId || !payload) {
      return buildResult({
        status: "clarification_required",
        summary: "נדרש יעד לעדכון תוכנית אימון.",
        replyText: "כדי לעדכן תוכנית אימון צריך programId ו-payload לעדכון.",
        resolvedClient,
        toolResults,
        usedTools,
        meta: {
          reason: "missing_program_update_fields",
        },
        audit: context.audit,
      });
    }

    const result = await executeAndTrack({
      toolName: "workout_update_client_program",
      args: {
        clientId: context.clientId,
        programId,
        payload,
      },
      context,
      usedTools,
      toolResults,
    });

    return buildResult({
      status: result.ok ? "ok" : "error",
      summary: result.ok
        ? `תוכנית האימון ${programId} עודכנה.`
        : `עדכון תוכנית האימון ${programId} נכשל.`,
      replyText: result.ok
        ? `עדכנתי את תוכנית האימון ${programId}.`
        : `לא הצלחתי לעדכן את תוכנית האימון ${programId}.`,
      resolvedClient,
      toolResults,
      usedTools,
      meta: result.meta,
      audit: context.audit,
    });
  }

  if (intent === "workout_log") {
    const payload = input.metadata?.payload;
    if (!payload) {
      return buildResult({
        status: "clarification_required",
        summary: "חסר payload לדיווח אימון.",
        replyText: "כדי לדווח אימון צריך להעביר workout payload.",
        resolvedClient,
        toolResults,
        usedTools,
        meta: {
          reason: "missing_workout_payload",
        },
        audit: context.audit,
      });
    }

    const result = await executeAndTrack({
      toolName: "coach_log_workout",
      args: {
        clientId: context.clientId,
        payload,
      },
      context,
      usedTools,
      toolResults,
    });

    return buildResult({
      status: result.ok ? "ok" : "error",
      summary: result.ok ? "האימון דווח בהצלחה." : "דיווח האימון נכשל.",
      replyText: result.ok ? "דיווחתי את האימון בהצלחה." : "לא הצלחתי לדווח את האימון.",
      resolvedClient,
      toolResults,
      usedTools,
      meta: result.meta,
      audit: context.audit,
    });
  }

  if (intent === "nutrition_overview") {
    const menus =
      clientSnapshot?.menus ||
      (await safeExecuteAndTrack({
        toolName: "nutrition_list_client_menus",
        args: { clientId: context.clientId },
        context,
        usedTools,
        toolResults,
      }));

    const count = Array.isArray(menus?.data) ? menus.data.length : 0;
    return buildResult({
      status: "ok",
      summary: "סקירת תזונה נשלפה.",
      replyText: `נמצאו ${count} תפריטים עבור הלקוח.`,
      resolvedClient,
      toolResults,
      usedTools,
      meta: { menuCount: count },
      audit: context.audit,
    });
  }

  if (intent === "workout_overview") {
    const programs =
      clientSnapshot?.programs ||
      (await safeExecuteAndTrack({
        toolName: "workout_list_client_programs",
        args: { clientId: context.clientId },
        context,
        usedTools,
        toolResults,
      }));

    const count = Array.isArray(programs?.data) ? programs.data.length : 0;
    return buildResult({
      status: "ok",
      summary: "סקירת אימונים נשלפה.",
      replyText: `נמצאו ${count} תוכניות אימון עבור הלקוח.`,
      resolvedClient,
      toolResults,
      usedTools,
      meta: { workoutProgramCount: count },
      audit: context.audit,
    });
  }

  if (intent === "conversation_overview") {
    const conversations =
      clientSnapshot?.allConversations
        ? { data: clientSnapshot.allConversations }
        : await safeExecuteAndTrack({
            toolName: "coach_list_conversations",
            context,
            usedTools,
            toolResults,
          });

    const all = Array.isArray(conversations?.data) ? conversations.data : [];
    const filtered = context.clientId
      ? clientSnapshot?.clientConversations ||
        all.filter(
          (conversation) =>
            conversation?.clientId === context.clientId ||
            conversation?.client?.id === context.clientId
        )
      : all;

    return buildResult({
      status: "ok",
      summary: "סקירת שיחות נשלפה.",
      replyText: `נמצאו ${filtered.length} שיחות רלוונטיות.`,
      resolvedClient,
      toolResults,
      usedTools,
      meta: {
        totalConversations: all.length,
        filteredConversations: filtered.length,
      },
      audit: context.audit,
    });
  }

  if (intent === "send_message") {
    const text = input.metadata?.text;
    const conversationId = input.metadata?.conversationId;
    if (!text || !conversationId) {
      return buildResult({
        status: "clarification_required",
        summary: "חסרים פרטים לשליחת הודעה.",
        replyText: "כדי לשלוח הודעה צריך conversationId וטקסט ההודעה.",
        resolvedClient,
        toolResults,
        usedTools,
        meta: { reason: "missing_message_target" },
        audit: context.audit,
      });
    }

    const result = await executeAndTrack({
      toolName: "coach_send_message",
      args: {
        conversationId,
        text,
      },
      context,
      usedTools,
      toolResults,
    });

    return buildResult({
      status: result.ok ? "ok" : "error",
      summary: result.ok ? "ההודעה נשלחה." : "שליחת ההודעה נכשלה.",
      replyText: result.ok ? "שלחתי את ההודעה בהצלחה." : "לא הצלחתי לשלוח את ההודעה.",
      resolvedClient,
      toolResults,
      usedTools,
      meta: result.meta,
      audit: context.audit,
    });
  }

  if (intent === "mark_message_handled") {
    const messageId = input.metadata?.messageId;
    const handledBy = input.metadata?.handledBy || "COACH";
    if (!messageId) {
      return buildResult({
        status: "clarification_required",
        summary: "חסר messageId לסימון כטופל.",
        replyText: "כדי לסמן הודעה כטופלה צריך messageId.",
        resolvedClient,
        toolResults,
        usedTools,
        meta: { reason: "missing_message_id" },
        audit: context.audit,
      });
    }

    const result = await executeAndTrack({
      toolName: "coach_mark_message_handled",
      args: {
        messageId,
        handledBy,
      },
      context,
      usedTools,
      toolResults,
    });

    return buildResult({
      status: result.ok ? "ok" : "error",
      summary: result.ok ? "ההודעה סומנה כטופלה." : "סימון ההודעה כטופלה נכשל.",
      replyText: result.ok ? "סימנתי את ההודעה כטופלה." : "לא הצלחתי לסמן את ההודעה כטופלה.",
      resolvedClient,
      toolResults,
      usedTools,
      meta: result.meta,
      audit: context.audit,
    });
  }

  if (resolvedClient?.id) {
    const dailyState =
      clientSnapshot?.dailyState ||
      (await safeExecuteAndTrack({
        toolName: "coach_get_daily_state",
        args: { clientId: context.clientId },
        context,
        usedTools,
        toolResults,
      }));

    const dayType = dailyState?.data?.dayType || "UNKNOWN";
    const menuCount = Array.isArray(clientSnapshot?.menus?.data)
      ? clientSnapshot.menus.data.length
      : 0;
    const workoutProgramCount = Array.isArray(clientSnapshot?.programs?.data)
      ? clientSnapshot.programs.data.length
      : 0;
    const conversationCount = Array.isArray(clientSnapshot?.clientConversations)
      ? clientSnapshot.clientConversations.length
      : 0;
    const weeklyEntryCount = Array.isArray(clientSnapshot?.dailyStateRange?.data)
      ? clientSnapshot.dailyStateRange.data.length
      : 0;

    return buildResult({
      status: "ok",
      summary: "הופעל פולבק אוטומטי לסקירת לקוח.",
      replyText: `התייחסתי לבקשה כסקירת לקוח עבור ${
        resolvedClient?.name || resolvedClient?.id
      }: סוג יום ${dayType}, תפריטים ${menuCount}, תוכניות אימון ${workoutProgramCount}, שיחות ${conversationCount}, רשומות שבועיות ${weeklyEntryCount}.`,
      resolvedClient,
      toolResults,
      usedTools,
      meta: {
        reason: "fallback_default_client_overview",
        inferredIntent: intent,
        dayType,
        menuCount,
        workoutProgramCount,
        conversationCount,
        weeklyEntryCount,
      },
      audit: context.audit,
    });
  }

  return buildResult({
    status: "clarification_required",
    summary: "לא הצלחתי לזהות פעולה מדויקת.",
    replyText:
      "בחר פעולה מהתפריט:\n1. סקירת לקוח\n2. התקדמות שבועית\n3. סקירת תזונה\n4. סקירת אימונים\n5. רשימת לקוחות\n6. שליחת הודעה\n7. סימון הודעה כטופלה\n\nאפשר להקליד מספר (1-7) או את שם הפעולה.",
    resolvedClient,
    toolResults,
    usedTools,
    meta: {
      reason: "unsupported_intent",
      intent,
      supportedOperations: [
        "client_overview",
        "client_week_progress",
        "nutrition_overview",
        "workout_overview",
        "clients_overview",
        "send_message",
        "mark_message_handled",
      ],
    },
    audit: context.audit,
  });
}
