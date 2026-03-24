import { StyleSheet, Text, View } from "react-native";
import type { WorkoutExercise } from "@/types/workout/workout.ui";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type WorkoutExerciseRowProps = {
  exercise: WorkoutExercise;
};

export function WorkoutExerciseRow({ exercise }: WorkoutExerciseRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.title}>{exercise.name}</Text>
        <Text style={styles.meta}>
          {exercise.sets} סטים · {exercise.reps} חזרות · מנוחה {exercise.restSeconds} שנ׳
        </Text>
      </View>
      <Text style={styles.weight}>{exercise.suggestedWeightKg} ק״ג</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm
  },
  copy: {
    flex: 1,
    alignItems: "flex-end",
    gap: 2
  },
  title: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right"
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "right"
  },
  weight: {
    color: colors.neon,
    fontSize: 12,
    fontWeight: "700"
  }
});
