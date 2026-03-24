import type { NutritionDayType } from "@/types/nutrition/nutrition.ui";

export type HomeFocusAction = "startWorkout" | "reportMeal";

export type HomeActivityRing = {
  label: string;
  valueLabel: string;
  progress: number;
  color: string;
};

export type HomeSnapshot = {
  userName: string;
  greetingTitle: string;
  dayType: NutritionDayType;
  focusAction: HomeFocusAction;
  focusLabel: string;
  caloriesLabel: string;
  macros: {
    protein: { consumed: number; target: number; progress: number };
    carbs: { consumed: number; target: number; progress: number };
    fat: { consumed: number; target: number; progress: number };
  };
  waterLabel: string;
  stepsLabel: string;
  activityRings: HomeActivityRing[];
  coachTip: {
    coachName: string;
    coachAvatarUrl: string;
    message: string;
  };
  nextWorkout: {
    id: string;
    title: string;
    category: string;
    metaLabel: string;
    thumbnailUrl: string;
  } | null;
};
