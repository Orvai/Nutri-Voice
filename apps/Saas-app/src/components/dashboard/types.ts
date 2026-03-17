import type { ClientExtended } from "@/types/client";

export type DateRangeValue = {
  startDate: string;
  endDate: string;
};

export type ClientTrackingSnapshot = {
  client: ClientExtended;
  isLoading: boolean;
  loggedDays: number;
  reportRate: number;
  targetDays: number;
  adherenceDays: number;
  adherenceRate: number | null;
  workoutLogs: number;
  latestWorkout:
    | {
        date: string | null;
        workoutType: string;
        effortLevel: string;
        notes: string | null;
        exercisesCount: number;
      }
    | null;
  averageSleepHours: number | null;
  lastReportDate: string | null;
};
