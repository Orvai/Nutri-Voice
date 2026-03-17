// services/tools/updateMeal.service.js
import { callGateway } from "../../../http/gatewayClient.js";
import {
  UpdateMealInputDto,
  UpdateMealResponseDto,
} from "../../../dtos/tools/menu-meal/updateMeal.dto.js";

export async function updateMeal(input, context) {
  const parsed = UpdateMealInputDto.parse(input);
  const { logId, ...payload } = parsed;
  const changedFields = Object.keys(payload);

  if (changedFields.length === 0) {
    throw new Error("At least one meal field must be provided for update");
  }

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

  const raw = res?.data?.data ?? res?.data ?? res;

  return UpdateMealResponseDto.parse({
    data: raw,
    diff: {
      changedFields,
      oldCalories: null,
      newCalories: Number.isFinite(raw?.calories) ? raw.calories : null,
      oldPortion: null,
      newPortion:
        typeof payload.description === "string" ? payload.description : raw?.description ?? null,
      oldFood: null,
      newFood:
        typeof payload.description === "string" ? payload.description : raw?.description ?? null,
    },
  });
}
