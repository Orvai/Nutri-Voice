import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { StatusView } from "@/components/ui/StatusView";
import { CoachHelpFallback } from "@/components/shared/CoachHelpFallback";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WorkoutSummaryCard } from "@/components/workout/WorkoutSummaryCard";
import { useWorkoutSummary } from "@/hooks/workout/useWorkoutFlow";

export default function WorkoutSummaryScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { summary, isLoading, isError, refetch } = useWorkoutSummary(id ?? "");

  if (!id) {
    return (
      <Screen>
        <StatusView type="error" title="מזהה אימון חסר" />
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen>
        <StatusView type="loading" title="טוען סיכום אימון" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <CoachHelpFallback onRetry={() => void refetch()} />
      </Screen>
    );
  }

  if (!summary) {
    return (
      <Screen>
        <StatusView
          type="empty"
          title="אין סיכום לאימון הזה"
          message="נסה לחזור לאימון ולסיים אותו מחדש"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="סיכום אימון" />
      <WorkoutSummaryCard
        summary={summary}
        onBackHome={() => router.replace("/(tabs)/home")}
        onNextAction={() => router.replace("/nutrition/report")}
      />
    </Screen>
  );
}
