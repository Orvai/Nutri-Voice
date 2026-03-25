import { View } from "react-native";
import type { UIExercise } from "@/types/ui/workout/exercise.ui";
import WorkoutExerciseCard from "./WorkoutExerciseCard";
import { styles } from "./styles/WorkoutExerciseGrid.styles";

type Props = {
  exercises: UIExercise[];
  onPress?: (exercise: UIExercise) => void;
  showMediaActions?: boolean;
};

export default function WorkoutExerciseGrid({
  exercises,
  onPress,
  showMediaActions = true,
}: Props) {
  return (
    <View style={styles.grid}>
      {exercises.map((ex) => (
        <WorkoutExerciseCard
          key={ex.id}
          item={ex}
          onPress={onPress ? () => onPress(ex) : undefined}
          showMediaActions={showMediaActions}
        />
      ))}
    </View>
  );
}
