// llm/tools/shouldCoachReply.tool.js
import {
    ShouldCoachReplyInputDto,
    ShouldCoachReplyResultDto,
  } from "../../dto/tools/shouldCoachReply.dto.js";
  
  export const shouldCoachReplyTool = {
    name: "should_coach_reply",
    description:
      "Decides whether the AI is allowed to reply automatically or should defer to a human coach.",
    execute: async (args) => {
      const input = ShouldCoachReplyInputDto.parse(args);
  
      const reasons = [];
  
      if (input.mentionsMedical) {
        reasons.push("אזכור נושא רפואי או רגיש");
      }
  
      if (input.hasUncertainty) {
        reasons.push("חוסר ודאות בהחלטה");
      }
  
      if (input.previewMeal) {
        if (input.previewMeal.matchType === "NONE") {
          reasons.push("האוכל לא נמצא בתפריט");
        }
  
        if (
          input.previewMeal.confidence !== undefined &&
          input.previewMeal.confidence < 0.4
        ) {
          reasons.push("רמת ביטחון נמוכה בהתאמה");
        }
  
        if (
          Array.isArray(input.previewMeal.warnings) &&
          input.previewMeal.warnings.length > 0
        ) {
          reasons.push("אזהרות תזונתיות");
        }
      }
  
      if (input.repeatedCorrections) {
        reasons.push("ריבוי תיקונים / חוסר יציבות");
      }
  
      const decision =
        reasons.length > 0 ? "COACH_REPLY" : "AUTO_REPLY";
  
      return ShouldCoachReplyResultDto.parse({
        decision,
        reasons,
      });
    },
  };
  