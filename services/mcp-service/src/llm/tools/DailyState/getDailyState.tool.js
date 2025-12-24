// src/llm/tools/getDailyState.tool.js

import { getDailyState } from "../../../services/tools/DailyState/getDailyState.service.js";

export const GetDailyStateTool = {
  /**
   * Name exposed to the LLM (must match registry + llmTools)
   */
  name: "get_daily_state",

  /**
   * Natural language description for the LLM
   */
  description: "Fetch today's nutrition and workout state for the current client",

  /**
   * JSON Schema for LLM function calling
   * (no args needed – client is derived from JWT)
   */
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },

  /**
   * Actual execution logic
   */
  async execute(_args, context) {


    return getDailyState(_args, context);
  },
};
