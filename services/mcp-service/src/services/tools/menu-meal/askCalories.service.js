// src/services/tools/menu-meal/askCalories.service.js
import { AskCaloriesResultDto } from "../../../dtos/tools/menu-meal/askCalories.dto.js";

/**
 * ASK_CALORIES (pure logic)
 * No gateway calls
 */
export async function askCalories(args = {}, context) {
  const dailyState = args.dailyState ?? context?.dailyState;

  if (!dailyState) {
    return AskCaloriesResultDto.parse({
      replyText: "אין לי עדיין Daily State להיום. ננסה למשוך אותו קודם 🙂",
    });
  }

  let replyText;

  if (dailyState.remainingCalories === null) {
    replyText = "עדיין לא נקבע יעד קלורי להיום 🙂";
  } else if (dailyState.remainingCalories < 0) {
    replyText = `חרגת היום ב־${Math.abs(dailyState.remainingCalories)} קלוריות ⚠️`;
  } else if (dailyState.remainingCalories === 0) {
    replyText = "סגרת בדיוק את היעד הקלורי להיום 👌";
  } else {
    replyText = `נשארו לך ${dailyState.remainingCalories} קלוריות להיום`;
  }

  return AskCaloriesResultDto.parse({ replyText });
}
