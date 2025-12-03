import { View, Text, Pressable, TextInput } from "react-native";

export default function WorkoutExerciseItem({ exercise, onRemove }) {
  return (
    <View
      style={{
        marginBottom: 12,
        padding: 12,
        backgroundColor: "#f9fafb",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        {exercise.name}
      </Text>

      <View style={{ flexDirection: "row-reverse", marginTop: 8, gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Text>סטים</Text>
          <TextInput
            defaultValue={exercise.sets.toString()}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 6,
              padding: 6,
              textAlign: "center",
            }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text>חזרות</Text>
          <TextInput
            defaultValue={exercise.reps}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 6,
              padding: 6,
              textAlign: "center",
            }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text>משקל</Text>
          <TextInput
            defaultValue={exercise.weight?.toString() ?? ""}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 6,
              padding: 6,
              textAlign: "center",
            }}
          />
        </View>
      </View>

      <Pressable onPress={onRemove} style={{ marginTop: 8 }}>
        <Text style={{ color: "#dc2626", textAlign: "right" }}>
          ✕ הסר תרגיל
        </Text>
      </Pressable>
    </View>
  );
}
