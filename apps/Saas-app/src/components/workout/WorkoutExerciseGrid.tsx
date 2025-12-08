import { View } from "react-native";
import type { UIExercise } from "../../types/ui/workout-ui";
import WorkoutExerciseCard from "./WorkoutExerciseCard";

type Props = {
  exercises: UIExercise[];
  onPress?: (exercise: UIExercise) => void;
};

export default function WorkoutExerciseGrid({ exercises, onPress }: Props) {
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 14,
      }}
    >
      {exercises.map((exercise) => (
        <View key={exercise.id} style={{ width: "48%" }}>
          <WorkoutExerciseCard
            item={exercise}
            onPress={onPress ? () => onPress(exercise) : undefined}
          />
        </View>
      ))}
    </View>
  );
}