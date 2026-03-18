// src/services/tools/menu-meal/askCalories.service.js
import { AskCaloriesResultDto } from "../../../../dtos/tools/menu-meal/askCalories.dto.js";

/**
 * ASK_CALORIES (pure logic)
 * No gateway calls
 */
export async function askCalories(args = {}, context) {
  const dailyState = args.dailyState ?? context?.dailyState;

  if (!dailyState) {
    return AskCaloriesResultDto.parse({
      kind: "DAILY_REMAINING",
      requiresDayType: false,
      requiresUserClarification: true,
      dailyImpact: {
        dailyCaloriesTarget: null,
        consumedCalories: 0,
        remainingCalories: null,
      },
      recommendationFlag: "NO_TARGET",
      summary: "אין לי עדיין מצב יומי מעודכן.",
      replyText: "אין לי עדיין Daily State להיום. ננסה למשוך אותו קודם 🙂",
    });
  }

  const remaining = dailyState.remainingCalories ?? null;
  const consumed = Number.isFinite(dailyState.consumedCalories)
    ? dailyState.consumedCalories
    : 0;
  const target = dailyState.activeCaloriesAllowed ?? null;

  let replyText = "";
  let recommendationFlag = "ON_TRACK";

  if (remaining === null) {
    replyText = "עדיין לא נקבע יעד קלורי להיום 🙂";
    recommendationFlag = "NO_TARGET";
  } else if (remaining < 0) {
    replyText = `חרגת היום ב־${Math.abs(remaining)} קלוריות ⚠️`;
    recommendationFlag = "OVER_BUDGET";
  } else if (remaining === 0) {
    replyText = "סגרת בדיוק את היעד הקלורי להיום 👌";
    recommendationFlag = "WATCH_PORTION";
  } else {
    replyText = `נשארו לך ${remaining} קלוריות להיום`;
    recommendationFlag = remaining < 250 ? "WATCH_PORTION" : "ON_TRACK";
  }

  return AskCaloriesResultDto.parse({
    kind: "DAILY_REMAINING",
    requiresDayType: !dailyState.dayType,
    requiresUserClarification: false,
    queryFoodText: typeof args.queryFoodText === "string" ? args.queryFoodText : undefined,
    estimatedCalories:
      Number.isFinite(args.estimatedCalories) ? args.estimatedCalories : undefined,
    portionAssumption:
      typeof args.portionAssumption === "string" ? args.portionAssumption : undefined,
    confidence: Number.isFinite(args.confidence) ? args.confidence : undefined,
    inMenu: typeof args.inMenu === "boolean" ? args.inMenu : undefined,
    matchedMenuItem:
      args.matchedMenuItem && typeof args.matchedMenuItem === "object"
        ? args.matchedMenuItem
        : undefined,
    outsideMenu: typeof args.outsideMenu === "boolean" ? args.outsideMenu : undefined,
    dailyImpact: {
      dailyCaloriesTarget: target,
      consumedCalories: consumed,
      remainingCalories: remaining,
    },
    recommendationFlag,
    summary: replyText,
    replyText,
  });
}
