import { callGateway } from "../../../../http/gatewayClient.js";

export const DAY_TYPES = ["TRAINING", "REST"];
export const DAY_TYPE_LABELS = {
  TRAINING: "יום העמסה",
  REST: "יום ללא העמסה",
};

export function toLocalDateKey(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function unwrapGatewayArray(result) {
  const maybeArray = result?.data?.data ?? result?.data ?? result ?? [];
  return Array.isArray(maybeArray) ? maybeArray : [];
}

export function getWeekBounds(targetDateInput) {
  const targetDate = targetDateInput ? new Date(targetDateInput) : new Date();
  if (Number.isNaN(targetDate.getTime())) {
    throw new Error("[dayTypeWeeklyBalance] Invalid target date");
  }

  const start = new Date(targetDate);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end, targetDate };
}

export function normalizeAllowedDaysPerWeek(value) {
  if (value === undefined || value === null) return 7;
  const n = Number(value);
  if (!Number.isFinite(n)) return 7;
  return Math.max(0, Math.min(7, Math.trunc(n)));
}

export function getOtherDayType(dayType) {
  return dayType === "TRAINING" ? "REST" : "TRAINING";
}

export function getProjectedCountIfSelected({
  dayType,
  usedDaysThisWeek,
  currentDayTypeForTargetDate,
}) {
  return (
    usedDaysThisWeek + (currentDayTypeForTargetDate === dayType ? 0 : 1)
  );
}

export function buildDayTypeBalanceItem({
  dayType,
  allowedDaysPerWeek,
  usedDaysThisWeek,
  currentDayTypeForTargetDate,
}) {
  const projectedCountIfSelected = getProjectedCountIfSelected({
    dayType,
    usedDaysThisWeek,
    currentDayTypeForTargetDate,
  });
  const isWithinLimitIfSelectedToday =
    allowedDaysPerWeek === null || projectedCountIfSelected <= allowedDaysPerWeek;

  return {
    dayType,
    label: DAY_TYPE_LABELS[dayType],
    allowedDaysPerWeek,
    usedDaysThisWeek,
    remainingDaysThisWeek:
      allowedDaysPerWeek === null
        ? null
        : Math.max(0, allowedDaysPerWeek - usedDaysThisWeek),
    projectedCountIfSelectedToday: projectedCountIfSelected,
    isWithinLimitIfSelectedToday,
  };
}

export async function getWeeklyDayTypeBalanceContext({ targetDate, context }) {
  const { start, end, targetDate: resolvedTargetDate } = getWeekBounds(targetDate);
  const startDate = toLocalDateKey(start);
  const endDate = toLocalDateKey(end);
  const targetDateKey = toLocalDateKey(resolvedTargetDate);

  const [menusRes, rangeRes] = await Promise.all([
    callGateway({
      contractKey: "CLIENT_MENUS_LIST",
      sender: context.sender,
      context,
    }),
    callGateway({
      contractKey: "DAILY_STATE_RANGE_GET",
      sender: context.sender,
      context,
      query: {
        startDate,
        endDate,
      },
    }),
  ]);

  const menus = unwrapGatewayArray(menusRes);
  const activeMenus = menus.filter((menu) => menu?.isActive);
  const limits = {
    TRAINING: null,
    REST: null,
  };

  for (const dayType of DAY_TYPES) {
    const activeMenu = activeMenus.find((menu) => menu?.type === dayType);
    if (!activeMenu) continue;
    limits[dayType] = normalizeAllowedDaysPerWeek(activeMenu.allowedDaysPerWeek);
  }

  const weekRows = unwrapGatewayArray(rangeRes);
  const usedDaysThisWeek = {
    TRAINING: 0,
    REST: 0,
  };
  let currentDayTypeForTargetDate = null;

  for (let i = 0; i < weekRows.length; i += 1) {
    const row = weekRows[i]?.data ?? weekRows[i] ?? {};
    const rowDayType =
      row?.dayType === "TRAINING" || row?.dayType === "REST" ? row.dayType : null;
    const rowDate =
      row?.date ||
      (() => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      })();
    const rowDateKey = toLocalDateKey(rowDate);

    if (rowDayType) {
      usedDaysThisWeek[rowDayType] += 1;
    }

    if (rowDateKey && targetDateKey && rowDateKey === targetDateKey) {
      currentDayTypeForTargetDate = rowDayType;
    }
  }

  return {
    weekStartDate: startDate,
    weekEndDate: endDate,
    targetDate: targetDateKey,
    currentDayTypeForTargetDate,
    dayTypes: {
      TRAINING: buildDayTypeBalanceItem({
        dayType: "TRAINING",
        allowedDaysPerWeek: limits.TRAINING,
        usedDaysThisWeek: usedDaysThisWeek.TRAINING,
        currentDayTypeForTargetDate,
      }),
      REST: buildDayTypeBalanceItem({
        dayType: "REST",
        allowedDaysPerWeek: limits.REST,
        usedDaysThisWeek: usedDaysThisWeek.REST,
        currentDayTypeForTargetDate,
      }),
    },
  };
}

