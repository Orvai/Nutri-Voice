import { View, Text, Pressable } from "react-native";
import WorkoutExerciseItem from "./WorkoutExerciseItem";

export default function WorkoutCategory({ group, exercises, onAdd, onRemove }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 16,
        marginBottom: 16,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
        {group}
      </Text>

      {exercises.map((ex) => (
        <WorkoutExerciseItem
          key={ex.id}
          exercise={ex}
          onRemove={() => onRemove(ex.id)}
        />
      ))}

      <Pressable
        onPress={onAdd}
        style={{
          marginTop: 10,
          paddingVertical: 8,
          borderRadius: 8,
          backgroundColor: "#e0f2fe",
        }}
      >
        <Text style={{ textAlign: "center", color: "#0284c7" }}>
          + הוסף תרגיל
        </Text>
      </Pressable>
    </View>
  );
}
