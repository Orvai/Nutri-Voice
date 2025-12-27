// src/services/tools/Metrics/upsertMetricsLog.service.js
import { callGateway } from "../../../http/gatewayClient.js";
import { UpsertMetricsToolDto, MetricsToolDto } from "../../../dtos/tools/DailyState/metricsLog.dto.js";

/**
 * @param {Object} args 
 * @param {Object} context 
 */
export async function upsertMetricsLog(args, context) {
  if (!context) {
    throw new Error("[upsertMetricsLog] context is missing");
  }

  const parsedArgs = UpsertMetricsToolDto.parse(args);

  const res = await callGateway({
    contractKey: "METRICS_LOG_UPSERT",
    sender: context.sender,
    context,

    body: parsedArgs
  });

  const raw = res?.data ?? res;

  return MetricsToolDto.parse(raw);
}