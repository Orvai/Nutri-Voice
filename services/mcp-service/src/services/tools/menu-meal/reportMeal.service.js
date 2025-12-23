// services/tools/reportMeal.service.js
import { callGateway } from "../../../http/gatewayClient.js";
import {
  ReportMealInputDto,
  ReportMealResponseDto,
} from "../../../dtos/tools/menu-meal/reportMeal.dto.js";

export async function reportMeal(input, context) {
  const payload = ReportMealInputDto.parse(input);

  const dailyDayType = context?.dailyState?.dayType;
  if (!dailyDayType) throw new Error("Missing dailyState.dayType");

  if (payload.dayType !== dailyDayType) {
    throw new Error(
      `dayType mismatch: payload=${payload.dayType}, dailyState=${dailyDayType}`
    );
  }

  const res = await callGateway({
    contractKey: "MEAL_LOG_CREATE",
    sender: context.sender,
    context,
    body: payload,
  });

  const raw = res?.data ?? res;
  return ReportMealResponseDto.parse(raw);
}
