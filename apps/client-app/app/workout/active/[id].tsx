import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { NeonButton } from "@/components/ui/NeonButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusView } from "@/components/ui/StatusView";
import { CoachHelpFallback } from "@/components/shared/CoachHelpFallback";
import { RestTimerCard } from "@/components/workout/RestTimerCard";
import { ActiveExerciseCard } from "@/components/workout/ActiveExerciseCard";
import { useActiveWorkout, useWorkoutMutations } from "@/hooks/workout/useWorkoutFlow";
import { colors } from "@/constants/colors";

export default function ActiveWorkoutScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { session, isLoading, isError, refetch } = useActiveWorkout(id ?? "");
  const {
    startWorkout,
    updateSet,
    finishWorkout,
    isStarting,
    isUpdatingSet,
    isFinishing,
    error
  } = useWorkoutMutations();

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
        <StatusView type="loading" title="טוען אימון פעיל" />
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

  if (!session) {
    return (
      <Screen>
        <StatusView
          type="empty"
          title="אין אימון פעיל כרגע"
          message="אפשר להתחיל את האימון ולדווח סטים בזמן אמת"
          actionLabel="התחל אימון"
          onActionPress={async () => {
            await startWorkout(id);
            await refetch();
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="אימון פעיל" actionLabel="חזור" onActionPress={() => router.back()} />

      <View style={styles.summary}>
        <Text style={styles.time}>התחלה: {session.startedAtLabel}</Text>
        <Text style={styles.progress}>
          התקדמות: {session.completedSets}/{session.totalSets} סטים
        </Text>
      </View>

      <RestTimerCard seconds={session.restSecondsRemaining} />

      {session.exerciseLogs.map((exercise) => (
        <ActiveExerciseCard
          key={exercise.exerciseId}
          exercise={exercise}
          isUpdating={isUpdatingSet}
          onCompleteSet={async (setNumber, reps, weightKg) => {
            await updateSet({
              programId: id,
              exerciseId: exercise.exerciseId,
              setNumber,
              reps,
              weightKg
            });
          }}
        />
      ))}

      <NeonButton
        label="סיים אימון"
        variant="accent"
        loading={isFinishing}
        onPress={async () => {
          await finishWorkout(id);
          router.replace(`/workout/summary/${id}` as never);
        }}
      />

      {isStarting ? <Text style={styles.info}>מכין אימון...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    gap: 4
  },
  time: {
    color: colors.textSecondary,
    textAlign: "right",
    fontSize: 13
  },
  progress: {
    color: colors.neon,
    textAlign: "right",
    fontSize: 15,
    fontWeight: "700"
  },
  info: {
    color: colors.textSecondary,
    textAlign: "right"
  },
  error: {
    color: colors.danger,
    textAlign: "right"
  }
});
