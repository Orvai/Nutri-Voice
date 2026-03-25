// src/llm/tools/DailyState/setDayType.tool.js
import { setDayType } from "../../../services/tools/DailyState/setDayType.service.js";

export const setDayTypeTool = {
  name: "set_day_type",

  description: `
Declare today's day type.
Use when user explicitly states today's type or when auto-resolution is clearly required.
If weekly quota is exceeded, tool may auto-apply the alternative day type and return warning metadata.
`,

  parameters: {
    type: "object",
    properties: {
      dayType: {
        type: "string",
        enum: ["TRAINING", "REST"],
        description: "Declared type of the day",
      },
      date: {
        type: "string",
        format: "date-time",
        description: "Optional ISO datetime (defaults to today)",
      },
      source: {
        type: "string",
        enum: ["USER_EXPLICIT", "AUTO", "COACH_SET"],
        description: "Why day type was set",
      },
      confidence: {
        type: "number",
        description: "Confidence for AUTO resolution (0..1)",
      },
      effectiveDate: {
        type: "string",
        format: "date-time",
        description: "Optional effective date override",
      },
    },
    required: ["dayType"],
    additionalProperties: false,
  },

  async execute(args, context) {
    return setDayType(args, context);
  },
};
