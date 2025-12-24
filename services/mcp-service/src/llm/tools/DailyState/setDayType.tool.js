// src/llm/tools/DailyState/setDayType.tool.js
import { setDayType } from "../../../services/tools/DailyState/setDayType.service.js";

export const setDayTypeTool = {
  name: "set_day_type",

  description: `
Declare today's day type.
Call this immediately when the user explicitly says
that today is a TRAINING or REST day.
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
    },
    required: ["dayType"],
    additionalProperties: false,
  },

  async execute(args, context) {
    return setDayType(args, context);
  },
};
