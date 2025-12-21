// llm/tools/reportMeal.tool.js
import { reportMeal } from "../../services/tools/menu-meal/reportMeal.service.js";

export const reportMealTool = {
  name: "report_meal",
  description:
    "Logs a meal for the current day. Requires explicit nutritional values and dayType.",
  execute: async (args, context) => {
    return reportMeal(args, context);
  },
};
