import { View, Text, Pressable } from "react-native";
import WorkoutExerciseItem from "./WorkoutExerciseItem";
import { styles } from "./styles/WorkoutCategory.styles";

export default function WorkoutCategory({
  group,
  exercises,
  onAdd,
  onRemove,
}) {
  const isEmptyCategory = !exercises.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{group}</Text>

        {onAdd ? (
          <Pressable onPress={onAdd} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ הוסף תרגיל</Text>
          </Pressable>
        ) : null}
      </View>

      {isEmptyCategory ? (
        <Text style={styles.emptyText}>
          אין עדיין תרגילים בקבוצה הזו.
        </Text>
      ) : (
        exercises.map((ex) => (
          <WorkoutExerciseItem
            key={ex.id}
            exercise={ex}
            onRemove={() => onRemove(ex.id)}
          />
        ))
      )}
    </View>
  );
}
