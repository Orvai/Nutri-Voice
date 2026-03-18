import { useCallback, useEffect, useMemo, useState } from "react";

import { useDailyAnalytics } from "@/hooks/tracking/useDailyAnalytics";
import { useDailyStateRangeWithOptions } from "@/hooks/tracking/useDailyState";
import type { DailyState } from "@/types/ui/tracking/daily-state.ui";
import type { CoachAnalytics, DateRange, ISODate } from "@/types/ui/tracking/coach-analytics.ui";

export type ProgressRangeValue = Pick<DateRange, "startDate" | "endDate">;

export type ProgressPresetKey = "last7Days" | "last14Days" | "last30Days" | "last90Days";

export type ProgressRangeOption = {
  key: ProgressPresetKey;
  label: string;
  days: number;
  range: ProgressRangeValue;
  isAvailable: boolean;
};

export type ProgressWidgetAvailability = {
  discipline: boolean;
  insights: boolean;
  streaks: boolean;
  calorieBehavior: boolean;
  nutrition: boolean;
  strength: boolean;
  recovery: boolean;
  correlations: boolean;
  body: boolean;
};

type UseClientProgressDataResult = {
  selectedRange: ProgressRangeValue;
  selectedPresetKey: ProgressPresetKey | null;
  availableRanges: ProgressRangeOption[];
  progressData: CoachAnalytics | null;
  widgetAvailability: ProgressWidgetAvailability;
  selectedRangeHasData: boolean;
  loading: boolean;
  error: unknown;
  availabilityLoading: boolean;
  setSelectedRange: (next: ProgressRangeValue) => void;
};

const PRESET_CONFIG: Array<{ key: ProgressPresetKey; label: string; days: number }> = [
  { key: "last7Days", label: "7 ימים", days: 7 },
  { key: "last14Days", label: "14 ימים", days: 14 },
  { key: "last30Days", label: "30 ימים", days: 30 },
  { key: "last90Days", label: "90 ימים", days: 90 },
];

const FALLBACK_PRESET_ORDER: ProgressPresetKey[] = ["last30Days", "last14Days", "last7Days", "last90Days"];

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function toISODate(date: Date): ISODate {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}` as ISODate;
}

function parseISODate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildRangeFromToday(days: number, anchorDate: Date): ProgressRangeValue {
  const end = new Date(anchorDate);
  const start = addDays(end, -(days - 1));

  return {
    startDate: toISODate(start),
    endDate: toISODate(end),
  };
}

function normalizeRange(range: ProgressRangeValue): ProgressRangeValue {
  if (range.startDate <= range.endDate) return range;

  return {
    startDate: range.endDate as ISODate,
    endDate: range.startDate as ISODate,
  };
}

function isSameRange(a: ProgressRangeValue, b: ProgressRangeValue): boolean {
  return a.startDate === b.startDate && a.endDate === b.endDate;
}

function isDayLogged(day: DailyState | null | undefined): boolean {
  if (!day) return false;

  const hasNutrition = (day.meals?.length || 0) > 0 || (day.consumedCalories || 0) > 0;
  const hasWorkouts = (day.workouts?.length || 0) > 0;
  const hasMetrics = !!day.metrics;
  const hasWeight = !!day.weight;

  return hasNutrition || hasWorkouts || hasMetrics || hasWeight;
}

function hasCaloriesTarget(day: DailyState): boolean {
  if (day.dayType === "TRAINING") return day.calorieTargets?.trainingDay != null;
  if (day.dayType === "REST") return day.calorieTargets?.restDay != null;
  return false;
}

export function useClientProgressData(clientId: string): UseClientProgressDataResult {
  const [todayAnchor] = useState(() => new Date());

  const presetRanges = useMemo(
    () => PRESET_CONFIG.map((preset) => ({ ...preset, range: buildRangeFromToday(preset.days, todayAnchor) })),
    [todayAnchor]
  );

  const defaultRange = useMemo(() => buildRangeFromToday(1, todayAnchor), [todayAnchor]);

  const [selectedRange, setSelectedRangeState] = useState<ProgressRangeValue>(defaultRange);

  const maxPreset = presetRanges.find((preset) => preset.key === "last90Days") ?? presetRanges[presetRanges.length - 1];

  const availabilityQuery = useDailyStateRangeWithOptions(maxPreset.range.startDate, maxPreset.range.endDate, clientId, {
    enabled: !!clientId,
    staleTime: 60_000,
  });

  const availabilityStates = availabilityQuery.data ?? [];

  const availableRanges = useMemo<ProgressRangeOption[]>(() => {
    const canCalculateAvailability = availabilityQuery.isSuccess;

    return presetRanges.map((preset) => {
      const presetStates = availabilityStates.slice(-preset.days);

      return {
        key: preset.key,
        label: preset.label,
        days: preset.days,
        range: preset.range,
        isAvailable: canCalculateAvailability ? presetStates.some(isDayLogged) : true,
      };
    });
  }, [availabilityQuery.isSuccess, availabilityStates, presetRanges]);

  const selectedPreset = useMemo(
    () => presetRanges.find((preset) => isSameRange(preset.range, selectedRange)) ?? null,
    [presetRanges, selectedRange]
  );

  const customRangeQuery = useDailyStateRangeWithOptions(selectedRange.startDate, selectedRange.endDate, clientId, {
    enabled: !!clientId && !selectedPreset,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!availabilityQuery.isSuccess || !selectedPreset) return;

    const selectedOption = availableRanges.find((option) => option.key === selectedPreset.key);
    if (selectedOption?.isAvailable) return;

    const fallback = FALLBACK_PRESET_ORDER.map((key) => availableRanges.find((option) => option.key === key)).find(
      (option) => option?.isAvailable
    );

    if (!fallback || isSameRange(fallback.range, selectedRange)) return;

    setSelectedRangeState(fallback.range);
  }, [availabilityQuery.isSuccess, availableRanges, selectedPreset, selectedRange]);

  const selectedDailyStates = useMemo<DailyState[]>(() => {
    if (selectedPreset) {
      return availabilityStates.slice(-selectedPreset.days);
    }

    return customRangeQuery.data ?? [];
  }, [availabilityStates, customRangeQuery.data, selectedPreset]);

  const selectedRangeHasData = useMemo(
    () => selectedDailyStates.some(isDayLogged),
    [selectedDailyStates]
  );

  const analytics = useDailyAnalytics(clientId, selectedRange, selectedDailyStates);
  const progressData = selectedRangeHasData ? analytics : null;

  const widgetAvailability = useMemo<ProgressWidgetAvailability>(() => {
    const hasNutritionData = selectedDailyStates.some(
      (day) => (day.meals?.length || 0) > 0 || (day.consumedCalories || 0) > 0
    );

    const hasWorkoutData = selectedDailyStates.some((day) => (day.workouts?.length || 0) > 0);

    const hasStrengthData = selectedDailyStates.some((day) =>
      (day.workouts || []).some((workout) =>
        (workout.exercises || []).some((exercise) => exercise.weight != null)
      )
    );

    const hasTargetData = selectedDailyStates.some(hasCaloriesTarget);
    const hasSleepData = selectedDailyStates.some((day) => day.metrics?.sleepHours != null);
    const hasStepsData = selectedDailyStates.some((day) => day.metrics?.steps != null);
    const hasHydrationData = selectedDailyStates.some((day) => day.metrics?.waterLiters != null);
    const hasWeightData = selectedDailyStates.some((day) => !!day.weight);

    return {
      discipline: selectedRangeHasData,
      insights: (progressData?.insights?.length ?? 0) > 0,
      streaks: selectedRangeHasData,
      calorieBehavior: hasTargetData,
      nutrition: hasNutritionData,
      strength: hasStrengthData,
      recovery: hasWorkoutData,
      correlations: hasWorkoutData && hasSleepData,
      body: hasWeightData || hasStepsData || hasSleepData || hasHydrationData,
    };
  }, [progressData?.insights?.length, selectedDailyStates, selectedRangeHasData]);

  const loading = selectedPreset ? availabilityQuery.isLoading : customRangeQuery.isLoading;
  const error = selectedPreset ? availabilityQuery.error : customRangeQuery.error;

  const setSelectedRange = useCallback((next: ProgressRangeValue) => {
    setSelectedRangeState(normalizeRange(next));
  }, []);

  return {
    selectedRange,
    selectedPresetKey: selectedPreset?.key ?? null,
    availableRanges,
    progressData,
    widgetAvailability,
    selectedRangeHasData,
    loading,
    error,
    availabilityLoading: availabilityQuery.isLoading,
    setSelectedRange,
  };
}

export function getProgressRangeDateLabel(range: ProgressRangeValue): string {
  const start = parseISODate(range.startDate);
  const end = parseISODate(range.endDate);

  const format = (date: Date) =>
    date.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return `${format(start)} - ${format(end)}`;
}
