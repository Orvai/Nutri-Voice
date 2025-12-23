// src/llm/tools/reportMeal.tool.js
import { reportMeal } from "../../../services/tools/menu-meal/reportMeal.service.js";

export const reportMealTool = {
  name: "report_meal",
  description:
    "Logs a meal for the current day. Requires explicit nutritional values and dayType.",

  parameters: {
    type: "object",
    properties: {
      calories: { type: "integer" },
      protein: { type: "integer" },
      carbs: { type: "integer" },
      fat: { type: "integer" },
      dayType: { type: "string", enum: ["TRAINING", "REST"] },

      date: { type: "string", description: "ISO datetime (optional)" },
      description: { type: "string" },
      matchedMenuItemId: { type: "string" },
    },
    required: ["calories", "protein", "carbs", "fat", "dayType"],
    additionalProperties: false,
  },

  execute: async (args, context) => {
    return reportMeal(args, context);
  },
};
