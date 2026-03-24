import {
  getConversationState,
  patchConversationState,
} from "../../infra/state/conversationState.store.js";

export function extractDayTypeFromText(text) {
  const normalized = String(text || "").trim().toLowerCase();
  if (!normalized) return null;

  const hasNoLoadKeyword =
    /יום\s*ללא\s*העמסה|ללא\s*העמסה|בלי\s*העמסה/.test(normalized);

  const isTraining =
    /יום\s*העמסה|העמסה|יום\s*אימון|אימון|התאמנתי|עשיתי אימון|סיימתי אימון/.test(
      normalized
    ) && !hasNoLoadKeyword;

  const isRest =
    /יום\s*ללא\s*העמסה|ללא\s*העמסה|בלי\s*העמסה|יום\s*מנוחה|מנוחה|נחתי/.test(
      normalized
    );

  if (isTraining && !isRest) return "TRAINING";
  if (isRest && !isTraining) return "REST";
  return null;
}

function toLocalDateKey(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function rememberResolvedDayType(conversationId, dayType, source) {
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

export function hydrateDayTypeFromState(context) {
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

export function syncDailyStateContext({ toolName, toolResult, args, context }) {
  if (toolName === "get_daily_state") {
    context.dailyState = toolResult?.data ?? toolResult;
    return;
  }

  if (toolName === "set_day_type") {
    if (toolResult?.error || toolResult?.success === false) {
      return;
    }

    const nextDayType = args?.dayType || toolResult?.data?.dayType || toolResult?.dayType;

    if (nextDayType) {
      context.dailyState = {
        ...(context.dailyState || {}),
        dayType: nextDayType,
      };
    }
  }
}
