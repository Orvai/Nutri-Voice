// llm/tools/updateMeal.tool.js
import { updateMeal } from "../../services/tools/menu-meal/updateMeal.service.js";

export const updateMealTool = {
  name: "update_meal",
  description:
    "Updates an existing meal log (fix quantities, description or nutritional values).",
  execute: async (args, context) => {
    return updateMeal(args, context);
  },
};
