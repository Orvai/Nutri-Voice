import { Pressable, Text } from "react-native";
import type { UIExercise } from "@/types/ui/workout/exercise.ui";
import { theme } from "../../theme";
import { styles } from "./styles/WorkoutExerciseItem.styles";

type Props = {
  item: UIExercise;
  onPress: () => void;
};

export default function WorkoutExerciseItem({ item, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: theme.card.bg,
          borderColor: theme.card.border,
        },
      ]}
    >
      <Text style={[styles.text, { color: theme.text.title }]}>
        {item.name}
      </Text>
    </Pressable>
  );
}
