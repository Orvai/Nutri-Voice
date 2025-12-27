// src/types/ui/tracking/daily-state.ui.ts

export type DayType = 'TRAINING' | 'REST';
export type EffortLevel = 'EASY' | 'NORMAL' | 'HARD' | 'FAILED' | 'SKIPPED';

export interface WorkoutExercise {
  id: string;
  exerciseName: string;
  weight: number | null;
}

export interface Workout {
  id: string;
  date: string;
  workoutType: string;
  effortLevel: EffortLevel;
  notes: string | null;
  exercises: WorkoutExercise[];
}

export interface Meal {
  id: string;
  date: string;
  dayType: DayType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string | null;
  matchedMenuItemId: string | null;
}

export interface DailyMetrics {
  id: string;
  steps: number | null;
  waterLiters: number | null;
  sleepHours: number | null;
  notes: string | null;
}

export interface DailyState {
  dayType: DayType | null;
  calorieTargets: {
    trainingDay: number | null;
    restDay: number | null;
  };
  activeCaloriesAllowed: number | null;
  consumedCalories: number;
  remainingCalories: number | null;
  meals: Meal[];
  workouts: Workout[];
  weight: {
    id: string;
    weightKg: number;
    notes: string | null;
    date: string;
  } | null;
  metrics: DailyMetrics | null;
}