// src/llm/tools/shouldCoachReply.tool.js
import {
  ShouldCoachReplyInputDto,
  ShouldCoachReplyResultDto,
} from "../../dtos/tools/shouldCoachReply.dto.js";

export const shouldCoachReplyTool = {
  name: "should_coach_reply",
  description:
    "Decides whether the AI is allowed to reply automatically or should defer to a human coach.",

  parameters: {
    type: "object",
    properties: {
      mentionsMedical: { type: "boolean" },
      hasUncertainty: { type: "boolean" },
      repeatedCorrections: { type: "boolean" },
      previewMeal: {
        type: "object",
        properties: {
          matchType: { type: "string", enum: ["NONE", "PARTIAL", "FULL"] },
          confidence: { type: "number" },
          warnings: { type: "array", items: { type: "string" } },
        },
        required: [],
        additionalProperties: true,
      },
    },
    required: [],
    additionalProperties: false,
  },

  execute: async (args) => {
    const input = ShouldCoachReplyInputDto.parse(args);

    const reasons = [];

    if (input.mentionsMedical) reasons.push("אזכור נושא רפואי או רגיש");
    if (input.hasUncertainty) reasons.push("חוסר ודאות בהחלטה");

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

    if (input.repeatedCorrections) reasons.push("ריבוי תיקונים / חוסר יציבות");

    const decision = reasons.length > 0 ? "COACH_REPLY" : "AUTO_REPLY";

    return ShouldCoachReplyResultDto.parse({
      decision,
      reasons,
    });
  },
};
