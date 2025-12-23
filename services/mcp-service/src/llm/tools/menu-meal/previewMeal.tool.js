// src/llm/tools/menu-meal/previewMeal.tool.js

import { previewMeal } from "../../../services/tools/menu-meal/previewMeal.service.js";

/**
 * LLM Tool: preview_meal
 *
 * Purpose:
 * Analyze whether the meal description provided by the client
 * matches the client's nutrition menu for the current day.
 *
 * This tool:
 * - does NOT mutate data
 * - does NOT call gateway directly
 * - relies on menu context fetched earlier
 */
export const previewMealTool = {
  name: "preview_meal",
  description: `
Analyze a meal description and determine whether it matches
the client's nutrition menu.

You MUST use this tool before reporting a meal,
in order to check confidence, matching items, and warnings.
`.trim(),

  // JSON Schema exposed to the LLM (NOT a DTO)
  parameters: {
    type: "object",
    properties: {
      description: {
        type: "string",
        description: "Free text description of what the client ate",
      },
      menuContext: {
        type: "object",
        description:
          "Menu context retrieved from get_menu_context (meals, options, items, vitamins, notes).",
      },
    },
    required: ["description", "menuContext"],
    additionalProperties: false,
  },

  async execute(args, context) {
    return previewMeal({
      description: args.description,
      menuContext: args.menuContext,
    });
  },
};
