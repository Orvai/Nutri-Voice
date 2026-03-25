import { DayTypeWeeklyBalanceDto } from "../../../../dtos/tools/DailyState/dayTypeWeeklyBalance.dto.js";
import { getWeeklyDayTypeBalanceContext } from "./dayTypeWeeklyBalance.utils.js";

function buildSummaryText(balance) {
  const training = balance.dayTypes.TRAINING;
  const rest = balance.dayTypes.REST;

  const trainingLimitText =
    training.allowedDaysPerWeek === null
      ? "ללא מכסה מוגדרת"
      : `${training.usedDaysThisWeek}/${training.allowedDaysPerWeek} (נשארו ${training.remainingDaysThisWeek})`;
  const restLimitText =
    rest.allowedDaysPerWeek === null
      ? "ללא מכסה מוגדרת"
      : `${rest.usedDaysThisWeek}/${rest.allowedDaysPerWeek} (נשארו ${rest.remainingDaysThisWeek})`;

  return [
    `שבוע ${balance.weekStartDate} עד ${balance.weekEndDate}.`,
    `ימי העמסה: ${trainingLimitText}.`,
    `ימים ללא העמסה: ${restLimitText}.`,
  ].join(" ");
}

export async function getDayTypeWeeklyBalance(args = {}, context) {
  if (!context) {
    throw new Error("[getDayTypeWeeklyBalance] context is missing");
  }

  const targetDate = typeof args?.date === "string" ? args.date : undefined;
  const balance = await getWeeklyDayTypeBalanceContext({
    targetDate,
    context,
  });

  return DayTypeWeeklyBalanceDto.parse({
    ...balance,
    summaryText: buildSummaryText(balance),
  });
}

