import { getMockState, updateMockState } from "@/data/mocks/mockStore";
import { mockRequest } from "@/data/mocks/mockRequest";
import { nutritionTotals } from "@/data/mocks/repositories/nutrition.helpers";
import type { HomeSnapshotDto } from "@/types/home/home.dto";

const buildHomeSnapshot = (): HomeSnapshotDto => {
  const state = getMockState();
  const user = state.auth.users[0];
  const dayType = state.nutrition.selectedDayType;
  const activePlan = state.nutrition.plans[dayType];
  const totals = nutritionTotals(activePlan);

  const todayWorkout = state.workout.programs.find((program) => program.isToday) ?? null;
  const workoutDone = todayWorkout ? Boolean(state.workout.summaries[todayWorkout.id]) : false;

  const focusAction =
    dayType === "training" && todayWorkout && !workoutDone
      ? "start_workout"
      : "report_meal";

  return {
    userName: user.firstName,
    dayLabel: "היום",
    dayType,
    focusAction,
    calorieTarget: activePlan.calorieTarget,
    consumedCalories: totals.calories,
    macros: {
      protein: {
        consumed: totals.protein,
        target: dayType === "training" ? 180 : 170
      },
      carbs: {
        consumed: totals.carbs,
        target: dayType === "training" ? 280 : 200
      },
      fat: {
        consumed: totals.fat,
        target: dayType === "training" ? 75 : 85
      }
    },
    waterMl: activePlan.waterMl,
    steps: state.home.steps,
    activityRings: [
      {
        label: "תנועה",
        current: Math.min(600, Math.round(totals.calories * 0.35)),
        target: 600,
        unit: "קל׳",
        color: "#ff4b4b"
      },
      {
        label: "אימון",
        current: workoutDone ? 60 : state.workout.activeSessions[todayWorkout?.id ?? ""] ? 35 : 20,
        target: 60,
        unit: "דק׳",
        color: "#e6ff00"
      },
      {
        label: "עמידה",
        current: 9,
        target: 12,
        unit: "ש׳",
        color: "#4b9fff"
      }
    ],
    coachTip: state.home.coachTip,
    nextWorkout: todayWorkout
      ? {
          id: todayWorkout.id,
          title: todayWorkout.title,
          category: todayWorkout.category,
          durationMinutes: todayWorkout.durationMinutes,
          exercisesCount: todayWorkout.exercises.length,
          intensity: todayWorkout.intensity,
          thumbnailUrl: todayWorkout.thumbnailUrl
        }
      : null
  };
};

export async function getHomeSnapshot(): Promise<HomeSnapshotDto> {
  return mockRequest("home", buildHomeSnapshot);
}

export async function addQuickWater(amountMl: number): Promise<HomeSnapshotDto> {
  return mockRequest("home", () => {
    if (amountMl <= 0) {
      throw new Error("כמות מים לא תקינה");
    }

    updateMockState((draft) => {
      draft.nutrition.plans.training.waterMl += amountMl;
      draft.nutrition.plans.rest.waterMl += amountMl;
    });

    return buildHomeSnapshot();
  });
}

export async function addQuickCalories(amount: number): Promise<HomeSnapshotDto> {
  return mockRequest("home", () => {
    if (amount <= 0) {
      throw new Error("כמות קלוריות לא תקינה");
    }

    const selectedDayType = getMockState().nutrition.selectedDayType;

    updateMockState((draft) => {
      draft.nutrition.plans[selectedDayType].manualCalories += amount;
    });

    return buildHomeSnapshot();
  });
}
