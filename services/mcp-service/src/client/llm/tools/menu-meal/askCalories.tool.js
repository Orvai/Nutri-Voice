import { askCalories } from "../../../services/tools/menu-meal/askCalories.service.js";

export const AskCaloriesTool = {
  name: "ask_calories",
  description: `
Use this tool for structured calorie status.

Primary use:
- "כמה נשאר לי?"
- "חרגתי?"
- "כמה קלוריות נשארו היום?"

It does NOT fetch data. It reads context daily state that was already fetched.
Returns machine-readable JSON (not final user phrasing).
  `.trim(),

  parameters: {
    type: "object",
    properties: {
      queryFoodText: {
        type: "string",
        description: "Optional food text for linking estimate metadata in the response.",
      },
      estimatedCalories: {
        type: "integer",
        description: "Optional estimated calories for quick what-if impact.",
      },
      inMenu: {
        type: "boolean",
        description: "Optional menu-fit signal if already known by previous tool output.",
      },
      matchedMenuItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
        },
        required: [],
        additionalProperties: false,
      },
      portionAssumption: { type: "string" },
      confidence: { type: "number" },
      outsideMenu: { type: "boolean" },
    },
    required: [],
    additionalProperties: false,
  },

  async execute(args, context) {
    return askCalories(args, context);
  },
};
