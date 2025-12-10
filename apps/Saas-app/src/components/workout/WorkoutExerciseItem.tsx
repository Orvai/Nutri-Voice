import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { UIWorkoutExercise } from "../../types/ui/workout-ui";
import { Tag } from "./common/Tag";
import ExerciseVideoPlayer from "./ExerciseVideoPlayer";
import { theme } from "../../theme";

type Props = {
  item: UIWorkoutExercise;
};

export default function WorkoutExerciseItem({ item }: Props) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(item.exercise.videoUrl ?? null);

  useEffect(() => {
    setVideoUrl(item.exercise.videoUrl ?? null);
  }, [item.exercise.videoUrl]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {item.order}. {item.exercise.name}
        </Text>
        <Text style={styles.subtitle}>
          {item.exercise.muscleGroup || "ללא שריר"}
        </Text>
      </View>

      <View style={styles.tagsRow}>
        <Tag label={`${item.sets} סטים`} tone="info" />
        {item.reps ? <Tag label={`${item.reps} חזרות`} tone="success" /> : null}
        {item.durationSeconds ? (
          <Tag label={`${item.durationSeconds} שניות`} tone="warning" />
        ) : null}
        {item.restSeconds ? <Tag label={`מנוחה ${item.restSeconds}s`} /> : null}
        {item.exercise.equipment ? <Tag label={item.exercise.equipment} /> : null}
        {videoUrl ? (
          <Pressable onPress={() => setShowVideo(true)} style={styles.videoButton}>
            <Text style={styles.videoButtonText}>▶ וידאו</Text>
          </Pressable>
        ) : null}
      </View>

      {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}

      <ExerciseVideoPlayer
        exercise={{ ...item.exercise, videoUrl }}
        visible={showVideo}
        onClose={() => setShowVideo(false)}
        onUpdated={(url) => setVideoUrl(url)}
      />
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
    color: "#4b5563",
    marginTop: 6,
    textAlign: "right",
  },
  videoButton: {
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  videoButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
});