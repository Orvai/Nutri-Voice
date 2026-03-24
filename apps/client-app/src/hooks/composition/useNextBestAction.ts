import { useMemo } from "react";
import type { HomeSnapshot } from "@/types/home/home.ui";

export type NextBestAction = {
  label: string;
  route: string;
};

export function useNextBestAction(homeData: HomeSnapshot | null): NextBestAction {
  return useMemo(() => {
    if (!homeData) {
      return {
        label: "דווח ארוחה",
        route: "/nutrition/report"
      };
    }

    if (homeData.focusAction === "startWorkout" && homeData.nextWorkout) {
      return {
        label: "התחל אימון",
        route: `/workout/${homeData.nextWorkout.id}`
      };
    }

    return {
      label: "דווח ארוחה",
      route: "/nutrition/report"
    };
  }, [homeData]);
}
