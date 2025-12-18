import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { UIExercise } from "@/types/ui/workout/exercise.ui";
import { Tag } from "./common/Tag";
import { theme } from "../../theme";

type Props = {
  exercises: UIExercise[];
  selectedIds?: string[];
  onSelect: (exercise: UIExercise) => void;
  isLoading?: boolean;
};

export default function ExercisePickerList({
  exercises,
  selectedIds = [],
  onSelect,
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.skeleton} />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={exercises}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const isSelected = selectedIds.includes(item.id);

        return (
          <Pressable
            onPress={() => onSelect(item)}
            style={[
              styles.card,
              isSelected && styles.cardSelected,
            ]}
          >
            <View style={styles.headerRow}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>
                {item.muscleGroup || "ללא שריר"}
              </Text>
            </View>

            <View style={styles.tagsRow}>
              {item.equipment ? (
                <Tag label={item.equipment} tone="info" />
              ) : null}
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },

  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.card.border,
    backgroundColor: theme.card.bg,
  },

  cardSelected: {
    borderColor: "#22c55e",
    backgroundColor: "#dcfce7",
  },

  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
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

  skeletonContainer: {
    gap: 10,
  },

  skeleton: {
    height: 64,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
});
