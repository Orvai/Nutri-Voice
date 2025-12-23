import { askCalories } from "../../../services/tools/menu-meal/askCalories.service.js";

export const AskCaloriesTool = {
  name: "ask_calories",
  description: `
Use this tool to answer questions about remaining calories.

You MUST use this tool when the user asks:
- "כמה נשאר לי?"
- "חרגתי?"
- "כמה קלוריות נשארו היום?"

This tool does NOT fetch data.
It assumes daily state was already retrieved using get_daily_state.
  `.trim(),

  parameters: {
    type: "object",
    properties: {},
    required: [],
  },

  async execute(context) {
    return askCalories(context.dailyState);
  },
};
