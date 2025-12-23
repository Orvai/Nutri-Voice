// src/llm/tools/updateMeal.tool.js
import { updateMeal } from "../../../services/tools/menu-meal/updateMeal.service.js";

export const updateMealTool = {
  name: "update_meal",
  description:
    "Updates an existing meal log (fix quantities, description or nutritional values).",

  parameters: {
    type: "object",
    properties: {
      logId: { type: "string", description: "Meal log id to update" },

      calories: { type: "integer" },
      protein: { type: "integer" },
      carbs: { type: "integer" },
      fat: { type: "integer" },
      dayType: { type: "string", enum: ["TRAINING", "REST"] },

      date: { type: "string", description: "ISO datetime (optional)" },
      description: { type: "string" },
      matchedMenuItemId: { type: "string" },
    },
    required: ["logId"],
    additionalProperties: false,
  },

  execute: async (args, context) => {
    return updateMeal(args, context);
  },
};
