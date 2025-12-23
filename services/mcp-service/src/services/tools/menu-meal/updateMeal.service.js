// services/tools/updateMeal.service.js
import { callGateway } from "../../../http/gatewayClient.js";
import {
  UpdateMealInputDto,
  UpdateMealResponseDto,
} from "../../../dtos/tools/menu-meal/updateMeal.dto.js";

export async function updateMeal(input, context) {
  const parsed = UpdateMealInputDto.parse(input);
  const { logId, ...payload } = parsed;

  if (payload.dayType) {
    const dailyDayType = context?.dailyState?.dayType;
    if (!dailyDayType) throw new Error("Missing dailyState.dayType");

    if (payload.dayType !== dailyDayType) {
      throw new Error(
        `dayType mismatch: payload=${payload.dayType}, dailyState=${dailyDayType}`
      );
    }
  }

  const res = await callGateway({
    contractKey: "MEAL_LOG_UPDATE",
    sender: context.sender, // חייב להיות client
    context,
    pathParams: { logId },
    body: payload,
  });

  const raw = res?.data ?? res;
  return UpdateMealResponseDto.parse(raw);
}
