import { getDayTypeWeeklyBalance } from "../../../services/tools/DailyState/getDayTypeWeeklyBalance.service.js";

export const getDayTypeWeeklyBalanceTool = {
  name: "get_day_type_weekly_balance",
  description:
    "Returns weekly quota usage for day types (TRAINING=יום העמסה, REST=יום ללא העמסה), including remaining days in the current week (Sunday to Saturday).",
  parameters: {
    type: "object",
    properties: {
      date: {
        type: "string",
        format: "date-time",
        description: "Optional reference date (defaults to now).",
      },
    },
    required: [],
    additionalProperties: false,
  },
  async execute(args, context) {
    return getDayTypeWeeklyBalance(args, context);
  },
};

