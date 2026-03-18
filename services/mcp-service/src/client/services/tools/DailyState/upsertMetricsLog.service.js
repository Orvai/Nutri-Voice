// src/services/tools/Metrics/upsertMetricsLog.service.js
import { callGateway } from "../../../../http/gatewayClient.js";
import { UpsertMetricsToolDto, MetricsToolDto } from "../../../../dtos/tools/DailyState/metricsLog.dto.js";

/**
 * @param {Object} args 
 * @param {Object} context 
 */
export async function upsertMetricsLog(args, context) {
  if (!context) {
    throw new Error("[upsertMetricsLog] context is missing");
  }

  const parsedArgs = UpsertMetricsToolDto.parse(args);
  const { updateMode = "ABSOLUTE", ...rest } = parsedArgs;

  let finalPayload = { ...rest };

  if (updateMode === "DELTA") {
    const dailyRes = await callGateway({
      contractKey: "DAILY_STATE_GET",
      sender: context.sender,
      context,
    });

    const daily = dailyRes?.data ?? dailyRes;
    const baseMetrics = daily?.metrics ?? {};

    if (typeof parsedArgs.steps === "number") {
      finalPayload.steps = (baseMetrics.steps ?? 0) + parsedArgs.steps;
    }

    if (typeof parsedArgs.waterLiters === "number") {
      finalPayload.waterLiters = Number((baseMetrics.waterLiters ?? 0) + parsedArgs.waterLiters);
    }

    if (typeof parsedArgs.sleepHours === "number") {
      finalPayload.sleepHours = Number((baseMetrics.sleepHours ?? 0) + parsedArgs.sleepHours);
    }
  }

  const res = await callGateway({
    contractKey: "METRICS_LOG_UPSERT",
    sender: context.sender,
    context,

    body: finalPayload
  });

  const raw = res?.data ?? res;
  return {
    ...MetricsToolDto.parse(raw),
    updateMode,
  };
}
