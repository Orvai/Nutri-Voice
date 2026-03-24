import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusView } from "@/components/ui/StatusView";
import { CoachHelpFallback } from "@/components/shared/CoachHelpFallback";
import { WorkoutProgramCard } from "@/components/workout/WorkoutProgramCard";
import { useWorkoutPrograms } from "@/hooks/workout/useWorkoutPrograms";
import { useWorkoutMutations } from "@/hooks/workout/useWorkoutFlow";
import { colors } from "@/constants/colors";

export default function WorkoutScreen() {
  const { programs, isLoading, isError, refetch } = useWorkoutPrograms();
  const { startWorkout, isStarting, error } = useWorkoutMutations();

  if (isLoading) {
    return (
      <Screen>
        <StatusView type="loading" title="טוען תוכנית אימון" />
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

  if (!programs.length) {
    return (
      <Screen>
        <StatusView
          type="empty"
          title="אין אימונים זמינים"
          message="המאמן עדיין לא שייך תוכנית אימון"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="אימונים" />

      {programs.map((program) => (
        <WorkoutProgramCard
          key={program.id}
          program={program}
          onOpen={() => router.push(`/workout/${program.id}` as never)}
          onStart={async () => {
            await startWorkout(program.id);
            router.push(`/workout/active/${program.id}` as never);
          }}
        />
      ))}

      {isStarting ? <Text style={styles.info}>מכין אימון...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  info: {
    color: colors.textSecondary,
    textAlign: "right"
  },
  error: {
    color: colors.danger,
    textAlign: "right"
  }
});
