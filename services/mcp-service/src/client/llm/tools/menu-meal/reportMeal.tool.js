// src/llm/tools/reportMeal.tool.js
import { reportMeal } from "../../../services/tools/menu-meal/reportMeal.service.js";

export const reportMealTool = {
  name: "report_meal",
  description:
    "Logs a meal for the current day using structured nutrition values. Can log both menu-matched and outside-menu meals.",

  parameters: {
    type: "object",
    properties: {
      calories: { type: "integer" },
      protein: { type: "integer" },
      carbs: { type: "integer" },
      fat: { type: "integer" },
      dayType: { type: "string", enum: ["TRAINING", "REST"] },

      date: { type: "string", description: "ISO datetime in format of: 'YYYY-MM-DDTHH:MM:SSZ'", default: () => new Date().toISOString() },
      description: { type: "string" },
      matchedMenuItemId: { type: "string" },
      source: { type: "string", enum: ["MENU_MATCH", "ESTIMATE", "USER_PROVIDED"] },
      confidence: { type: "number" },
      isEstimated: { type: "boolean" },
      outsideMenu: { type: "boolean" },
      portionText: { type: "string" },
      caloriesUsedForLog: { type: "integer" },
    },
    required: ["calories", "protein", "carbs", "fat", "dayType"],
    additionalProperties: false,
  },

  execute: async (args, context) => {
    return reportMeal(args, context);
  },
};
