// apps/Saas-app/src/components/client-profile/workout/WorkoutExerciseItem.tsx

import { View, Text, Pressable } from "react-native";

type Props = {
  exercise: {
    id: string;
    name: string;
    muscleGroup: string | null;
    sets: number;
    reps: string;
    weight: number | null;
  };
  onRemove: () => void;
};

export default function WorkoutExerciseItem({ exercise, onRemove }: Props) {
  return (
    <View
      style={{
        marginTop: 8,
        padding: 10,
        borderRadius: 12,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#111827",
              textAlign: "right",
            }}
          >
            {exercise.name}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#6b7280",
              textAlign: "right",
              marginTop: 2,
            }}
          >
            {exercise.muscleGroup ?? "ללא שיוך שריר"}
          </Text>
        </View>

        <View
          style={{
            alignItems: "flex-end",
            gap: 2,
          }}
        >
          <Text style={{ fontSize: 11, color: "#374151" }}>
            סטים:{" "}
            <Text style={{ fontWeight: "700" }}>{exercise.sets}</Text>
          </Text>
          <Text style={{ fontSize: 11, color: "#374151" }}>
            חזרות:{" "}
            <Text style={{ fontWeight: "700" }}>{exercise.reps}</Text>
          </Text>
          <Text style={{ fontSize: 11, color: "#374151" }}>
            משקל:{" "}
            <Text style={{ fontWeight: "700" }}>
              {exercise.weight != null ? `${exercise.weight} ק״ג` : "-"}
            </Text>
          </Text>
        </View>
      </View>

      <Pressable onPress={onRemove} style={{ marginTop: 6, alignSelf: "flex-end" }}>
        <Text style={{ color: "#dc2626", fontSize: 11 }}>✕ הסר תרגיל</Text>
      </Pressable>
    </View>
  );
}
