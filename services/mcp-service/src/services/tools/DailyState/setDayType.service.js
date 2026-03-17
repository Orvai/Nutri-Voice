// src/services/tools/DailyState/setDayType.service.js
import { callGateway } from "../../../http/gatewayClient.js";
import { DaySelectionCreateDto } from "../../../dtos/tools/DailyState/daySelectionCreate.dto.js";

/**
 * SET DAY TYPE
 * ------------------------------
 * Side effect:
 * - Persists today's day type (TRAINING / REST)
 *
 * Source of truth:
 * - DaySelectionCreateDto
 * - Gateway contract: DAY_SELECTION_CREATE (ClientContext.SELF)
 */
export async function setDayType(args, context) {
  if (!context) {
    throw new Error("[setDayType] context is missing");
  }

  const payload = DaySelectionCreateDto.parse(args);
  const gatewayPayload = {
    dayType: payload.dayType,
    date: payload.effectiveDate || payload.date,
  };

  const res = await callGateway({
    contractKey: "DAY_SELECTION_CREATE",
    sender: context.sender,
    context,
    body: gatewayPayload,
  });

  return {
    success: true,
    data: res?.data ?? res,
    meta: {
      source: payload.source ?? "USER_EXPLICIT",
      confidence: payload.confidence ?? null,
      effectiveDate: gatewayPayload.date ?? null,
    },
  };
}
