// src/services/tools/DailyState/setDayType.service.js
import { callGateway } from "../../../../http/gatewayClient.js";
import { DaySelectionCreateDto } from "../../../../dtos/tools/DailyState/daySelectionCreate.dto.js";

const WEEKLY_LIMIT_CODE = "DAY_TYPE_WEEKLY_LIMIT_REACHED";

function toLocalDateKey(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function unwrapGatewayArray(result) {
  const maybeArray = result?.data?.data ?? result?.data ?? result ?? [];
  return Array.isArray(maybeArray) ? maybeArray : [];
}

function getWeekBounds(targetDateInput) {
  const targetDate = targetDateInput ? new Date(targetDateInput) : new Date();
  if (Number.isNaN(targetDate.getTime())) {
    throw new Error("[setDayType] Invalid target date");
  }

  const start = new Date(targetDate);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end, targetDate };
}

function normalizeAllowedDaysPerWeek(value) {
  if (value === undefined || value === null) return 7;
  const n = Number(value);
  if (!Number.isFinite(n)) return 7;
  return Math.max(0, Math.min(7, Math.trunc(n)));
}

async function getAllowedDaysPerWeekForDayType({ dayType, context }) {
  const menusRes = await callGateway({
    contractKey: "CLIENT_MENUS_LIST",
    sender: context.sender,
    context,
  });
  const menus = unwrapGatewayArray(menusRes);
  const activeMenu = menus.find((menu) => menu?.isActive && menu?.type === dayType);
  if (!activeMenu) return null;
  return normalizeAllowedDaysPerWeek(activeMenu.allowedDaysPerWeek);
}

async function getWeeklyDayTypeStats({ dayType, targetDate, context }) {
  const { start, end } = getWeekBounds(targetDate);
  const startDate = toLocalDateKey(start);
  const endDate = toLocalDateKey(end);
  const targetDateKey = toLocalDateKey(targetDate);

  const rangeRes = await callGateway({
    contractKey: "DAILY_STATE_RANGE_GET",
    sender: context.sender,
    context,
    query: {
      startDate,
      endDate,
    },
  });

  const rangeRows = unwrapGatewayArray(rangeRes);
  let currentWeekCount = 0;
  let targetDateCurrentDayType = null;

  for (let i = 0; i < rangeRows.length; i += 1) {
    const row = rangeRows[i]?.data ?? rangeRows[i] ?? {};
    const rowDayType = row?.dayType ?? null;
    const rowDate =
      row?.date ||
      (() => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      })();
    const rowDateKey = toLocalDateKey(rowDate);

    if (rowDayType === dayType) {
      currentWeekCount += 1;
    }

    if (rowDateKey && targetDateKey && rowDateKey === targetDateKey) {
      targetDateCurrentDayType = rowDayType;
    }
  }

  const projectedWeekCount =
    currentWeekCount + (targetDateCurrentDayType === dayType ? 0 : 1);

  return {
    startDate,
    endDate,
    currentWeekCount,
    targetDateCurrentDayType,
    projectedWeekCount,
  };
}

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
  const gatewayPayload = {
    dayType: payload.dayType,
    date: targetDateInput,
  };

  const allowedDaysPerWeek = await getAllowedDaysPerWeekForDayType({
    dayType: payload.dayType,
    context,
  });

  if (allowedDaysPerWeek !== null) {
    const weeklyStats = await getWeeklyDayTypeStats({
      dayType: payload.dayType,
      targetDate: targetDateInput,
      context,
    });

    if (weeklyStats.projectedWeekCount > allowedDaysPerWeek) {
      const dayTypeLabel =
        payload.dayType === "TRAINING" ? "יום העמסה" : "יום ללא העמסה";

      return {
        success: false,
        recoverable: true,
        code: WEEKLY_LIMIT_CODE,
        error: "Weekly day-type limit reached",
        userMessage: `אי אפשר להגדיר ${dayTypeLabel} כי כבר הגעת למכסה השבועית (${weeklyStats.currentWeekCount}/${allowedDaysPerWeek}).`,
        data: {
          dayType: payload.dayType,
          allowedDaysPerWeek,
          currentWeekCount: weeklyStats.currentWeekCount,
          projectedWeekCount: weeklyStats.projectedWeekCount,
          weekStartDate: weeklyStats.startDate,
          weekEndDate: weeklyStats.endDate,
        },
        meta: {
          source: payload.source ?? "USER_EXPLICIT",
          confidence: payload.confidence ?? null,
          effectiveDate: gatewayPayload.date ?? null,
        },
      };
    }
  }

  const res = await callGateway({
    contractKey: "DAY_SELECTION_CREATE",
    sender: context.sender,
    context,
    body: gatewayPayload,
  });

  return {
    success: true,
    data: res?.data ?? res,
    meta: {
      source: payload.source ?? "USER_EXPLICIT",
      confidence: payload.confidence ?? null,
      effectiveDate: gatewayPayload.date ?? null,
    },
  };
}
