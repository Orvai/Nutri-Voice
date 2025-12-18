import { StyleSheet, View } from "react-native";

import type { UIExercise } from "@/types/ui/workout/exercise.ui";
import WorkoutExerciseCard from "./WorkoutExerciseCard";

type Props = {
  exercises: UIExercise[];
  onPress?: (exercise: UIExercise) => void;
};

export default function WorkoutExerciseGrid({
  exercises,
  onPress,
}: Props) {
  return (
    <View style={styles.grid}>
      {exercises.map((exercise) => (
        <View key={exercise.id} style={styles.item}>
          <WorkoutExerciseCard
            item={exercise}
            onPress={
              onPress ? () => onPress(exercise) : undefined
            }
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  item: {
    width: "48%",
  },
});
