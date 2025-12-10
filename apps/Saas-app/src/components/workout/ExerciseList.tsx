import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { UIExercise } from "../../types/ui/workout-ui";
import { Tag } from "./common/Tag";
import ExerciseVideoPlayer from "./ExerciseVideoPlayer";
import { theme } from "../../theme";

interface Props {
  exercises: UIExercise[];
  selectedIds?: string[];
  onSelect?: (exercise: UIExercise) => void;
  isLoading?: boolean;
}

export default function ExerciseList({
  exercises,
  selectedIds = [],
  onSelect,
  isLoading = false,
}: Props) {
  const [videoExercise, setVideoExercise] = useState<UIExercise | null>(null);
  const [videoOverrides, setVideoOverrides] = useState<Record<string, string>>({});
  const skeletons = useMemo(() => Array.from({ length: 4 }), []);

  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        {skeletons.map((_, index) => (
          <View key={index} style={styles.skeleton} />
        ))}
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => {
          const effectiveVideoUrl = videoOverrides[item.id] ?? item.videoUrl ?? null;
          const isSelected = selectedIds.includes(item.id);
          return (
            <Pressable
              onPress={() => onSelect?.(item)}
              style={[
                styles.card,
                isSelected && { borderColor: "#22c55e", backgroundColor: "#dcfce7" },
              ]}
            >
              <View style={styles.headerRow}>
                <Text style={styles.title}>{item.name}</Text>
                <View style={styles.headerActions}>
                  {effectiveVideoUrl ? (
                    <Pressable
                      onPress={() =>
                        setVideoExercise({ ...item, videoUrl: effectiveVideoUrl })
                      }
                      style={styles.videoIcon}
                    >
                      <Text style={styles.videoIconText}>🎬</Text>
                    </Pressable>
                  ) : null}
                  <Text style={styles.subtitle}>
                    {item.muscleGroup || "ללא שריר"}
                  </Text>
                </View>
              </View>
              <View style={styles.tagsRow}>
                {(item.secondaryMuscles ?? []).map((muscle) => (
                  <Tag key={muscle} label={muscle} />
                ))}
                {item.equipment ? <Tag label={item.equipment} /> : null}
                <Tag label={translateDifficulty(item.difficulty)} tone="info" />
              </View>
              {item.instructions ? (
                <Text style={styles.instructions} numberOfLines={2}>
                  {item.instructions}
                </Text>
              ) : null}
            </Pressable>
          );
        }}
      />

      {videoExercise ? (
        <ExerciseVideoPlayer
          exercise={videoExercise}
          visible={!!videoExercise}
          onClose={() => setVideoExercise(null)}
          onUpdated={(url) =>
            setVideoExercise((prev) => {
              if (!prev) return prev;
              setVideoOverrides((overrides) => ({ ...overrides, [prev.id]: url }));
              return { ...prev, videoUrl: url };
            })
          }
        />
      ) : null}
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
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.card.border,
    backgroundColor: theme.card.bg,
  },
  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    textAlign: "right",
    color: theme.text.title,
    flex: 1,
  },
  subtitle: {
    color: theme.text.subtitle,
    textAlign: "right",
  },
  tagsRow: {
    flexDirection: "row-reverse",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 6,
  },
  instructions: {
    marginTop: 6,
    color: "#4b5563",
    textAlign: "right",
  },
  videoIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  videoIconText: {
    fontSize: 16,
  },
  skeletonContainer: {
    gap: 10,
  },
  skeleton: {
    height: 70,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
});