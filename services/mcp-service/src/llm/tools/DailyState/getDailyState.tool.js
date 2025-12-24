// src/llm/tools/getDailyState.tool.js

import { getDailyState } from "../../../services/tools/DailyState/getDailyState.service.js";

export const GetDailyStateTool = {
  name: "get_daily_state",
  description: "Fetch today's nutrition and workout state for the current client",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
  async execute(_args, context) {


    return getDailyState(_args, context);
  },
};
