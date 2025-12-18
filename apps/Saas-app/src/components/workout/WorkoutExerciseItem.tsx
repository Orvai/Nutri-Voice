import { View, Text, StyleSheet, Pressable } from "react-native";
import type { UIWorkoutExercise } from "@/types/ui/workout/workoutExercise.ui";
import { Tag } from "./common/Tag";
import { theme } from "../../theme";

type Props = {
  item: UIWorkoutExercise;
  onPlayVideo?: () => void;
};

export default function WorkoutExerciseItem({
  item,
  onPlayVideo,
}: Props) {
  const { exercise } = item;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {item.order}. {exercise.name}
        </Text>
        <Text style={styles.subtitle}>
          {exercise.muscleGroup || "ללא שריר"}
        </Text>
      </View>

      {/* Tags */}
      <View style={styles.tagsRow}>
        <Tag label={`${item.sets} סטים`} tone="info" />
        {item.reps ? (
          <Tag label={`${item.reps} חזרות`} tone="success" />
        ) : null}
        {item.durationSeconds ? (
          <Tag label={`${item.durationSeconds} שניות`} tone="warning" />
        ) : null}
        {item.restSeconds ? (
          <Tag label={`מנוחה ${item.restSeconds}s`} />
        ) : null}
        {exercise.equipment ? (
          <Tag label={exercise.equipment} />
        ) : null}

        {exercise.videoUrl && onPlayVideo ? (
          <Pressable
            onPress={onPlayVideo}
            style={styles.videoButton}
          >
            <Text style={styles.videoButtonText}>וידאו</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Notes */}
      {item.notes ? (
        <Text style={styles.notes}>{item.notes}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.card.border,
    marginBottom: 8,
  },

  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 8,
  },

  title: {
    fontWeight: "700",
    fontSize: 16,
    textAlign: "right",
    color: theme.text.title,
  },

  subtitle: {
    color: theme.text.subtitle,
    textAlign: "right",
  },

  tagsRow: {
    flexDirection: "row-reverse",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 6,
  },

  notes: {
    color: theme.text.subtitle,
    marginTop: 6,
    textAlign: "right",
    fontSize: 13,
  },

  videoButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.card.bg,
    borderWidth: 1,
    borderColor: theme.card.border,
  },

  videoButtonText: {
    fontWeight: "600",
    fontSize: 12,
    color: theme.text.title,
  },
});
