// services/tools/reportMeal.service.js
import { callGateway } from "../../../../http/gatewayClient.js";
import {
  ReportMealInputDto,
  ReportMealResponseDto,
} from "../../../../dtos/tools/menu-meal/reportMeal.dto.js";

export async function reportMeal(input, context) {
  const payload = ReportMealInputDto.parse(input);

  const dailyDayType = context?.dailyState?.dayType;
  if (!dailyDayType) throw new Error("Missing dailyState.dayType");

  if (payload.dayType !== dailyDayType) {
    throw new Error(
      `dayType mismatch: payload=${payload.dayType}, dailyState=${dailyDayType}`
    );
  }

  const gatewayPayload = {
    date: payload.date,
    calories: payload.calories,
    protein: payload.protein,
    carbs: payload.carbs,
    fat: payload.fat,
    description: payload.description,
    matchedMenuItemId: payload.matchedMenuItemId,
    dayType: payload.dayType,
  };

  const res = await callGateway({
    contractKey: "MEAL_LOG_CREATE",
    sender: context.sender,
    context,
    body: gatewayPayload,
  });

  const raw = res?.data ?? res;
  return ReportMealResponseDto.parse({
    data: raw?.data ?? raw,
    meta: {
      source: payload.source ?? "ESTIMATE",
      confidence: payload.confidence ?? null,
      isEstimated: payload.isEstimated ?? payload.source === "ESTIMATE",
      outsideMenu: payload.outsideMenu ?? false,
      portionText: payload.portionText ?? null,
      caloriesUsedForLog: payload.caloriesUsedForLog ?? payload.calories,
    },
  });
}
