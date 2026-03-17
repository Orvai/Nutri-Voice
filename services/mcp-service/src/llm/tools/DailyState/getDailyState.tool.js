// src/llm/tools/getDailyState.tool.js

import { getDailyState } from "../../../services/tools/DailyState/getDailyState.service.js";

export const GetDailyStateTool = {
  name: "get_daily_state",
  description:
    "Fetches structured daily state for current client: dayType, calorie target/consumption, meals/workout summaries, metrics summary, and missing critical fields.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
  async execute(_args, context) {


    return getDailyState(_args, context);
  },
};
