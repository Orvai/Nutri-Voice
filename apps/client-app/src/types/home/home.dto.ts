import type { NutritionDayTypeDto } from "@/types/nutrition/nutrition.dto";

export type HomeFocusActionDto = "start_workout" | "report_meal";

export type HomeActivityRingDto = {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
};

export type HomeCoachTipDto = {
  coachName: string;
  coachAvatarUrl: string;
  message: string;
};

export type HomeNextWorkoutDto = {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  exercisesCount: number;
  intensity: "low" | "medium" | "high";
  thumbnailUrl: string;
};

export type HomeSnapshotDto = {
  userName: string;
  dayLabel: string;
  dayType: NutritionDayTypeDto;
  focusAction: HomeFocusActionDto;
  calorieTarget: number;
  consumedCalories: number;
  macros: {
    protein: { consumed: number; target: number };
    carbs: { consumed: number; target: number };
    fat: { consumed: number; target: number };
  };
  waterMl: number;
  steps: number;
  activityRings: HomeActivityRingDto[];
  coachTip: HomeCoachTipDto;
  nextWorkout: HomeNextWorkoutDto | null;
};
