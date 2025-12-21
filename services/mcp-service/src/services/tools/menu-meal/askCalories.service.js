import { AskCaloriesResultDto } from "../../../dtos/tools/askCalories.dto.js";

/**
 * ASK_CALORIES
 */
export function askCalories(dailyState) {
  let replyText;

  if (dailyState.remainingCalories === null) {
    replyText = "עדיין לא נקבע יעד קלורי להיום 🙂";
  }

  else if (dailyState.remainingCalories < 0) {
    replyText = `חרגת היום ב־${Math.abs(
      dailyState.remainingCalories
    )} קלוריות ⚠️`;
  }

  else if (dailyState.remainingCalories === 0) {
    replyText = "סגרת בדיוק את היעד הקלורי להיום 👌";
  }

  else {
    replyText = `נשארו לך ${dailyState.remainingCalories} קלוריות להיום`;
  }

  return AskCaloriesResultDto.parse({ replyText });
}
