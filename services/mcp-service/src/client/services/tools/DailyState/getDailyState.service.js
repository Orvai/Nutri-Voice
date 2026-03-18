// src/services/tools/DailyState/getDailyState.service.js
import { callGateway } from "../../../../http/gatewayClient.js";
import { DailyStateToolDto } from "../../../../dtos/tools/DailyState/dailyState.dto.js";

export async function getDailyState(_, context) {
  if (!context) {
    throw new Error("[getDailyState] context is missing");
  }

  const res = await callGateway({
    contractKey: "DAILY_STATE_GET",
    sender: context.sender,
    context,
    pathParams: {
      clientId: context.clientId 
    }
  });

  const raw = res?.data ?? res;
  const parsed = DailyStateToolDto.parse(raw);

  const dailyCaloriesTarget =
    parsed.dayType === "TRAINING"
      ? parsed.calorieTargets.trainingDay
      : parsed.dayType === "REST"
      ? parsed.calorieTargets.restDay
      : null;

  const meals = parsed.meals ?? [];
  const workouts = parsed.workouts ?? [];
  const lastMealAt = meals.length
    ? (meals[meals.length - 1].loggedAt || meals[meals.length - 1].date || null)
    : null;

  const missingCriticalFields = [];
  if (!parsed.dayType) missingCriticalFields.push("dayType");
  if (dailyCaloriesTarget === null) missingCriticalFields.push("dailyCaloriesTarget");

  return DailyStateToolDto.parse({
    ...parsed,
    dailyCaloriesTarget,
    mealsSummary: {
      count: meals.length,
      lastMealAt,
    },
    metricsSummary: {
      hasMetrics: !!parsed.metrics,
      steps: parsed.metrics?.steps ?? null,
      waterLiters: parsed.metrics?.waterLiters ?? null,
      sleepHours: parsed.metrics?.sleepHours ?? null,
    },
    workoutPlanned: workouts.length > 0,
    workoutCompleted: workouts.some((w) => w.effortLevel !== "SKIPPED"),
    missingCriticalFields,
  });
}
