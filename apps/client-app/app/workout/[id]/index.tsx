import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusView } from "@/components/ui/StatusView";
import { CoachHelpFallback } from "@/components/shared/CoachHelpFallback";
import { WorkoutExerciseRow } from "@/components/workout/WorkoutExerciseRow";
import { useWorkoutPreview } from "@/hooks/workout/useWorkoutPrograms";
import { useWorkoutMutations } from "@/hooks/workout/useWorkoutFlow";
import { colors } from "@/constants/colors";

export default function WorkoutPreviewScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { workout, isLoading, isError, refetch } = useWorkoutPreview(id ?? "");
  const { startWorkout, isStarting, error } = useWorkoutMutations();

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
        <StatusView type="loading" title="טוען תצוגת אימון" />
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

  if (!workout) {
    return (
      <Screen>
        <StatusView type="empty" title="האימון לא נמצא" />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="תצוגת אימון" actionLabel="חזור" onActionPress={() => router.back()} />

      <NeonCard>
        <View style={styles.summary}>
          <Text style={styles.title}>{workout.title}</Text>
          <Text style={styles.meta}>{workout.category}</Text>
          <Text style={styles.meta}>
            {workout.durationLabel} · {workout.exercisesCount} תרגילים · {workout.intensityLabel}
          </Text>
        </View>
      </NeonCard>

      <NeonCard>
        {workout.exercises.map((exercise) => (
          <WorkoutExerciseRow key={exercise.id} exercise={exercise} />
        ))}
      </NeonCard>

      <NeonButton
        label="התחל אימון"
        loading={isStarting}
        onPress={async () => {
          await startWorkout(id);
          router.replace(`/workout/active/${id}` as never);
        }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    gap: 6
  },
  title: {
    color: colors.white,
    fontSize: 24,
    textAlign: "right",
    fontWeight: "800"
  },
  meta: {
    color: colors.textSecondary,
    textAlign: "right",
    fontSize: 13
  },
  error: {
    color: colors.danger,
    textAlign: "right"
  }
});
