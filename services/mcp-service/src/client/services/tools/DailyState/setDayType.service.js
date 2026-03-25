// src/services/tools/DailyState/setDayType.service.js
import { callGateway } from "../../../../http/gatewayClient.js";
import { DaySelectionCreateDto } from "../../../../dtos/tools/DailyState/daySelectionCreate.dto.js";
import {
  DAY_TYPE_LABELS,
  getOtherDayType,
  getWeeklyDayTypeBalanceContext,
} from "./dayTypeWeeklyBalance.utils.js";

const WEEKLY_LIMIT_CODE = "DAY_TYPE_WEEKLY_LIMIT_REACHED";

/**
 * SET DAY TYPE
 * ------------------------------
 * Side effect:
 * - Persists today's day type (TRAINING / REST)
 *
 * Source of truth:
 * - DaySelectionCreateDto
 * - Gateway contract: DAY_SELECTION_CREATE (ClientContext.SELF)
 */
export async function setDayType(args, context) {
  if (!context) {
    throw new Error("[setDayType] context is missing");
  }

  const payload = DaySelectionCreateDto.parse(args);
  const targetDateInput = payload.effectiveDate || payload.date;
  const requestedDayType = payload.dayType;

  const weeklyBalance = await getWeeklyDayTypeBalanceContext({
    targetDate: targetDateInput,
    context,
  });

  const requestedBalance = weeklyBalance.dayTypes[requestedDayType];
  const alternativeDayType = getOtherDayType(requestedDayType);
  const alternativeBalance = weeklyBalance.dayTypes[alternativeDayType];

  let effectiveDayType = requestedDayType;
  let autoAdjusted = false;
  let adjustmentUserMessage = null;

  if (!requestedBalance.isWithinLimitIfSelectedToday) {
    if (alternativeBalance.isWithinLimitIfSelectedToday) {
      effectiveDayType = alternativeDayType;
      autoAdjusted = true;
      const requestedLimitText =
        requestedBalance.allowedDaysPerWeek === null
          ? ""
          : ` (${requestedBalance.usedDaysThisWeek}/${requestedBalance.allowedDaysPerWeek})`;
      adjustmentUserMessage = `הגעת למכסה השבועית של ${requestedBalance.label}${requestedLimitText}, לכן הגדרתי את היום כ-${alternativeBalance.label}.`;
    } else {
      return {
        success: false,
        recoverable: true,
        code: WEEKLY_LIMIT_CODE,
        error: "Weekly day-type limit reached",
        userMessage:
          "אי אפשר לעדכן כרגע את סוג היום כי שתי המכסות השבועיות מלאות. אפשר לעדכן מול המאמן/ת את ההגדרות.",
        data: {
          requestedDayType,
          alternativeDayType,
          requestedDayTypeLabel: DAY_TYPE_LABELS[requestedDayType],
          alternativeDayTypeLabel: DAY_TYPE_LABELS[alternativeDayType],
          weekStartDate: weeklyBalance.weekStartDate,
          weekEndDate: weeklyBalance.weekEndDate,
          targetDate: weeklyBalance.targetDate,
          currentDayTypeForTargetDate: weeklyBalance.currentDayTypeForTargetDate,
          weeklyBalance: weeklyBalance.dayTypes,
        },
        meta: {
          source: payload.source ?? "USER_EXPLICIT",
          confidence: payload.confidence ?? null,
          requestedDayType,
          effectiveDayType: null,
          autoAdjusted: false,
          effectiveDate: targetDateInput ?? null,
        },
      };
    }
  }

  const gatewayPayload = {
    dayType: effectiveDayType,
    date: targetDateInput,
  };

  const res = await callGateway({
    contractKey: "DAY_SELECTION_CREATE",
    sender: context.sender,
    context,
    body: gatewayPayload,
  });
  const rawResponseData = res?.data ?? res;
  const responseData =
    rawResponseData && typeof rawResponseData === "object" ? rawResponseData : {};
  const persistedDayType = responseData?.dayType || effectiveDayType;

  return {
    success: true,
    data: {
      ...responseData,
      dayType: persistedDayType,
      requestedDayType,
      weeklyBalance: weeklyBalance.dayTypes,
      weekStartDate: weeklyBalance.weekStartDate,
      weekEndDate: weeklyBalance.weekEndDate,
      targetDate: weeklyBalance.targetDate,
    },
    warning: autoAdjusted
      ? {
          code: WEEKLY_LIMIT_CODE,
          userMessage: adjustmentUserMessage,
          requestedDayType,
          effectiveDayType: persistedDayType,
        }
      : null,
    userMessage: autoAdjusted ? adjustmentUserMessage : null,
    meta: {
      source: payload.source ?? "USER_EXPLICIT",
      confidence: payload.confidence ?? null,
      requestedDayType,
      effectiveDayType: persistedDayType,
      autoAdjusted,
      effectiveDate: gatewayPayload.date ?? null,
    },
  };
}
