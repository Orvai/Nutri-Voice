import type { HomeSnapshotDto } from "@/types/home/home.dto";
import type { HomeSnapshot } from "@/types/home/home.ui";
import { clampPercent, formatNumber } from "@/utils/format";

export const mapHomeSnapshotToUI = (dto: HomeSnapshotDto): HomeSnapshot => ({
  userName: dto.userName,
  greetingTitle: `${dto.dayLabel} · ההתקדמות של ${dto.userName}`,
  dayType: dto.dayType,
  focusAction: dto.focusAction === "start_workout" ? "startWorkout" : "reportMeal",
  focusLabel:
    dto.focusAction === "start_workout" ? "התחל אימון" : "דווח ארוחה",
  caloriesLabel: `${formatNumber(dto.consumedCalories)} / ${formatNumber(dto.calorieTarget)} קל׳`,
  macros: {
    protein: {
      consumed: dto.macros.protein.consumed,
      target: dto.macros.protein.target,
      progress: clampPercent(dto.macros.protein.consumed / dto.macros.protein.target)
    },
    carbs: {
      consumed: dto.macros.carbs.consumed,
      target: dto.macros.carbs.target,
      progress: clampPercent(dto.macros.carbs.consumed / dto.macros.carbs.target)
    },
    fat: {
      consumed: dto.macros.fat.consumed,
      target: dto.macros.fat.target,
      progress: clampPercent(dto.macros.fat.consumed / dto.macros.fat.target)
    }
  },
  waterLabel: `${(dto.waterMl / 1000).toFixed(1)} ל׳`,
  stepsLabel: formatNumber(dto.steps),
  activityRings: dto.activityRings.map((ring) => ({
    label: ring.label,
    valueLabel: `${formatNumber(ring.current)} / ${formatNumber(ring.target)} ${ring.unit}`,
    progress: clampPercent(ring.current / ring.target),
    color: ring.color
  })),
  coachTip: dto.coachTip,
  nextWorkout: dto.nextWorkout
    ? {
        id: dto.nextWorkout.id,
        title: dto.nextWorkout.title,
        category: dto.nextWorkout.category,
        metaLabel: `${dto.nextWorkout.durationMinutes} דק׳ · ${dto.nextWorkout.exercisesCount} תרגילים`,
        thumbnailUrl: dto.nextWorkout.thumbnailUrl
      }
    : null
});
