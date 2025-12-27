import { upsertMetricsLog } from "../../../services/tools/DailyState/upsertMetricsLog.service.js";

export const UpsertMetricsLogTool = {
  name: "upsert_metrics_log",
  description: "Update or create daily health metrics like steps, water intake, and sleep hours for the current client",
  parameters: {
    type: "object",
    properties: {
      steps: {
        type: "integer",
        description: "Total number of steps taken today (e.g., 8500)",
        minimum: 0
      },
      waterLiters: {
        type: "number",
        description: "Total water consumed in liters (e.g., 2.5)",
        minimum: 0
      },
      sleepHours: {
        type: "number",
        description: "Total hours of sleep (e.g., 7.5)",
        minimum: 0,
        maximum: 24
      },
      notes: {
        type: "string",
        description: "Additional notes or context regarding the metrics"
      },
      date: {
        type: "string",
        description: "ISO date string (YYYY-MM-DD). Use this only if the user specifically mentions a past date. Defaults to today."
      }
    },
    required: [], 
  },
  async execute(args, context) {
    return upsertMetricsLog(args, context);
  },
};