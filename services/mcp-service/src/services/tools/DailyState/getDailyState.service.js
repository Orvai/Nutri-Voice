// src/services/tools/DailyState/getDailyState.service.js
import { callGateway } from "../../../http/gatewayClient.js";
import { DailyStateToolDto } from "../../../dtos/tools/DailyState/dailyState.dto.js";

/**
 * GET DAILY STATE
 * Source of truth: Gateway Contract (NO side effects)
 */
export async function getDailyState(_, context) {
  if (!context) {
    throw new Error("[getDailyState] context is missing");
  }
  const res = await callGateway({
    contractKey: "DAILY_STATE_GET",
    sender: context.sender,
    context,
  });

  const raw = res?.data ?? res;
  return DailyStateToolDto.parse(raw);
}
