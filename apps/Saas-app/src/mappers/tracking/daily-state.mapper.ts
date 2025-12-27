// src/mappers/tracking/daily-state.mapper.ts
import { DailyState } from "@/types/ui/tracking/daily-state.ui";

export const mapDailyState = (raw: any): DailyState => {
  if (!raw) return {} as DailyState;

  return {
    dayType: raw.dayType || null,
    calorieTargets: {
      trainingDay: raw.calorieTargets?.trainingDay ?? null,
      restDay: raw.calorieTargets?.restDay ?? null,
    },
    activeCaloriesAllowed: raw.activeCaloriesAllowed ?? null,
    consumedCalories: raw.consumedCalories || 0,
    remainingCalories: raw.remainingCalories ?? null,
    
    meals: (raw.meals || []).map((m: any) => ({
      ...m,
      description: m.description || null,
      matchedMenuItemId: m.matchedMenuItemId || null,
    })),

    workouts: (raw.workouts || []).map((w: any) => ({
      ...w,
      notes: w.notes || null,
      exercises: w.exercises || [],
    })),

    weight: raw.weight ? {
      id: raw.weight.id,
      weightKg: raw.weight.weightKg,
      notes: raw.weight.notes || null,
      date: raw.weight.date
    } : null,

    metrics: raw.metrics ? {
      id: raw.metrics.id,
      steps: raw.metrics.steps ?? 0,
      waterLiters: raw.metrics.waterLiters ?? 0,
      sleepHours: raw.metrics.sleepHours ?? null,
      notes: raw.metrics.notes || null
    } : null,
  };
};