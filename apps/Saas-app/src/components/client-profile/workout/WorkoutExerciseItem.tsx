import { View, Text, Pressable } from "react-native";
import { styles } from "./styles/WorkoutExerciseItem.styles";

export default function WorkoutExerciseItem({ exercise, onRemove }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.name}>{exercise.name}</Text>
          <Text style={styles.muscle}>
            {exercise.muscleGroup ?? "ללא שיוך שריר"}
          </Text>
        </View>

        <View style={styles.stats}>
          <Text style={styles.statText}>
            סטים: <Text style={styles.strong}>{exercise.sets}</Text>
          </Text>
          <Text style={styles.statText}>
            חזרות: <Text style={styles.strong}>{exercise.reps}</Text>
          </Text>
          <Text style={styles.statText}>
            משקל:{" "}
            <Text style={styles.strong}>
              {exercise.weight != null ? `${exercise.weight} ק״ג` : "-"}
            </Text>
          </Text>
        </View>
      </View>

      <Pressable onPress={onRemove} style={styles.remove}>
        <Text style={styles.removeText}>✕ הסר תרגיל</Text>
      </Pressable>
    </View>
  );
}
