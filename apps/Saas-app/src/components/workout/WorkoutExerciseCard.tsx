import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { UIExercise } from "../../types/ui/workout-ui";
import { Card } from "./common/Card";
import { AvatarBadge } from "./common/AvatarBadge";
import { Chip } from "./common/Chip";
import { Tag } from "./common/Tag";
import ExerciseVideoPlayer from "./ExerciseVideoPlayer";
import { theme } from "../../theme";

type Props = {
  item: UIExercise;
  onPress?: () => void;
};

export default function WorkoutExerciseCard({ item, onPress }: Props) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(item.videoUrl ?? null);

  useEffect(() => {
    setVideoUrl(item.videoUrl ?? null);
  }, [item.videoUrl]);

  return (
    <>
      <Pressable onPress={onPress} disabled={!onPress}>
        <Card style={styles.card}>
          {videoUrl ? (
            <Pressable onPress={() => setShowVideo(true)} style={styles.videoThumb}>
              <View style={styles.playBadge}>
                <Text style={styles.playText}>▶</Text>
              </View>
              <Text style={styles.videoLabel}>צפה בוידאו</Text>
            </Pressable>
          ) : null}

          <View style={styles.header}>
            <AvatarBadge label={item.name} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>
            {item.muscleGroup || "ללא שריר ראשי"}
              </Text>
            </View>
            <Chip label={translateDifficulty(item.difficulty)} tone="accent" />
          </View>

          <View style={styles.tagsRow}>
            {(item.secondaryMuscles ?? []).map((muscle) => (
              <Tag key={muscle} label={muscle} />
            ))}
            {item.equipment ? <Tag label={item.equipment} tone="info" /> : null}
          </View>

          {item.instructions ? (
            <Text style={styles.instructions} numberOfLines={2}>
              {item.instructions}
            </Text>
          ) : null}
        </Card>
      </Pressable>

      <ExerciseVideoPlayer
        exercise={{ ...item, videoUrl }}
        visible={showVideo}
        onClose={() => setShowVideo(false)}
        onUpdated={(url) => setVideoUrl(url)}
      />
    </>
  );
}

function translateDifficulty(value: UIExercise["difficulty"]) {
  switch (value) {
    case "beginner":
      return "מתחיל";
    case "intermediate":
      return "ביניים";
    case "advanced":
      return "מתקדם";
    default:
      return value;
  }
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  title: {
    fontWeight: "800",
    fontSize: 16,
    textAlign: "right",
    color: theme.text.title,
  },
  subtitle: {
    fontSize: 13,
    color: theme.text.subtitle,
    marginTop: 2,
    textAlign: "right",
  },
  tagsRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
  },
  instructions: {
    fontSize: 13,
    color: "#4b5563",
    textAlign: "right",
  },
  videoThumb: {
    height: 140,
    borderRadius: theme.card.radius,
    borderWidth: 1,
    borderColor: theme.card.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: "#0f172a",
  },
  playBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  playText: {
    fontSize: 20,
    color: theme.text.title,
  },
  videoLabel: {
    color: "#fff",
    fontWeight: "700",
  },
});