import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/TodayWorkout.styles";
import type { Workout } from "@/types/ui/tracking/daily-state.ui";

type Props = {
  workouts?: Workout[];
  workout?: any;
};

function effortLabel(level: Workout["effortLevel"]) {
  if (level === "EASY") return "קל";
  if (level === "NORMAL") return "רגיל";
  if (level === "HARD") return "קשה";
  if (level === "FAILED") return "נכשל";
  return "דולג";
}

function effortStyle(level: Workout["effortLevel"]) {
  if (level === "EASY") return styles.effortEasy;
  if (level === "NORMAL") return styles.effortNormal;
  if (level === "HARD") return styles.effortHard;
  if (level === "FAILED") return styles.effortFailed;
  return styles.effortSkipped;
}

function formatWorkoutTime(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "ללא שעה";
  return parsed.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

function normalizeLegacyWorkout(legacy: any): Workout | null {
  if (!legacy) return null;
  return {
    id: legacy.id || "legacy-workout",
    date: legacy.date || new Date().toISOString(),
    workoutType: legacy.title || legacy.workoutType || "Workout",
    effortLevel: legacy.effortLevel || legacy.effort || "NORMAL",
    notes: legacy.notes || null,
    exercises: Array.isArray(legacy.exercises)
      ? legacy.exercises.map((ex: any, idx: number) => ({
          id: ex.id || `legacy-ex-${idx}`,
          exerciseName: ex.exerciseName || ex.name || "Exercise",
          weight: ex.weight ?? null,
        }))
      : Array.from({ length: Number(legacy.exercisesCount || 0) }).map((_, idx) => ({
          id: `legacy-count-${idx}`,
          exerciseName: `Exercise ${idx + 1}`,
          weight: null,
        })),
  };
}

export default function TodayWorkout({ workouts, workout }: Props) {
  const legacyWorkout = normalizeLegacyWorkout(workout);
  const safeWorkouts =
    Array.isArray(workouts) && workouts.length
      ? workouts
      : legacyWorkout
      ? [legacyWorkout]
      : [];
  const hasReports = safeWorkouts.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>דיווחי אימון</Text>
        <Text style={[styles.status, hasReports ? styles.statusDone : styles.statusPending]}>
          {hasReports ? `${safeWorkouts.length} דיווחים` : "לא דווח"}
        </Text>
      </View>

      {__DEV__ ? (
        <Text style={styles.devTag}>V2: workoutType / effortLevel / notes / exercises</Text>
      ) : null}

      {!hasReports ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>עדיין לא דווח אימון להיום.</Text>
        </View>
      ) : (
        safeWorkouts.map((workout) => (
          <View key={workout.id} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Ionicons name="barbell" size={20} color="#2563eb" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.workoutTitle}>{workout.workoutType || "אימון"}</Text>
                <Text style={styles.muted}>דווח ב־{formatWorkoutTime(workout.date)}</Text>
              </View>
            </View>

            <View style={styles.infoChips}>
              <View style={[styles.infoChip, effortStyle(workout.effortLevel)]}>
                <Text style={styles.infoChipText}>עצימות: {effortLabel(workout.effortLevel)}</Text>
              </View>
              <View style={styles.infoChip}>
                <Text style={styles.infoChipText}>תרגילים: {workout.exercises?.length ?? 0}</Text>
              </View>
            </View>

            {workout.notes ? <Text style={styles.notes}>הערה: {workout.notes}</Text> : null}

            <View style={styles.exercisesWrap}>
              {(workout.exercises || []).length === 0 ? (
                <Text style={styles.exerciseEmpty}>לא דווחו תרגילים באימון הזה.</Text>
              ) : (
                (workout.exercises || []).map((exercise) => (
                  <View key={exercise.id} style={styles.exerciseRow}>
                    <Text style={styles.exerciseValue}>
                      {exercise.weight != null ? `${exercise.weight} ק"ג` : "ללא משקל"}
                    </Text>
                    <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );
}
