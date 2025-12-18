import React from "react";
import { View, Text, Pressable } from "react-native";
import WorkoutExerciseItem from "./WorkoutExerciseItem";

type ExerciseViewModel = {
  id: string;
  name: string;
  muscleGroup: string | null;
  sets: number;
  reps: string;
  weight: number | null;
};

type Props = {
  group: string;
  exercises: ExerciseViewModel[];
  onAdd?: () => void;          // אם קיים → יש כפתור
  onRemove: (id: string) => void;
};

export default function WorkoutCategory({
  group,
  exercises,
  onAdd,
  onRemove,
}: Props) {
  const isEmptyCategory = !exercises.length;

  return (
    <View
      style={{
        backgroundColor: "#f9fafb",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 14,
        marginBottom: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: "#111827",
            textAlign: "right",
          }}
        >
          {group}
        </Text>

        {onAdd ? (
          <Pressable
            onPress={onAdd}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: "#eff6ff",
            }}
          >
            <Text
              style={{
                color: "#2563eb",
                fontSize: 12,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              + הוסף תרגיל
            </Text>
          </Pressable>
        ) : null}
      </View>

      {isEmptyCategory ? (
        <Text
          style={{
            fontSize: 12,
            color: "#9ca3af",
            textAlign: "right",
            marginTop: 4,
          }}
        >
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
