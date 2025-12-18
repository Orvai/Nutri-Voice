import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import type { UIExercise } from "@/types/ui/workout/exercise.ui";
import { Tag } from "./common/Tag";
import { theme } from "../../theme";
import { styles } from "./styles/ExercisePickerList.styles";

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
              {
                borderColor: theme.card.border,
                backgroundColor: theme.card.bg,
              },
              isSelected && styles.cardSelected,
            ]}
          >
            <View style={styles.headerRow}>
              <Text style={[styles.title, { color: theme.text.title }]}>
                {item.name}
              </Text>
              <Text style={[styles.subtitle, { color: theme.text.subtitle }]}>
                {item.muscleGroup || "ללא שריר"}
              </Text>
            </View>

            <View style={styles.tagsRow}>
              {item.equipment ? <Tag label={item.equipment} tone="info" /> : null}
            </View>
          </Pressable>
        );
      }}
    />
  );
}
