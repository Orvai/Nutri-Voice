// apps/Saas-app/src/components/client-profile/workout/WorkoutPlanCard.tsx

import React, { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";

import type { UIWorkoutProgram }
  from "../../../types/ui/workout/workoutProgram.ui";
import type { UIExercise }
  from "../../../types/ui/workout/exercise.ui";

import WorkoutCategory from "./WorkoutCategory";
import AddExerciseModal from "./AddExerciseModal";

type Props = {
  plan: UIWorkoutProgram;
  allExercises: UIExercise[];

  onAddExercise: (
    exercise: UIExercise,
    orderHint?: number,
    meta?: { sets: number; reps: string }
  ) => void | Promise<void>;

  onRemoveExercise: (
    workoutExerciseId: string
  ) => void | Promise<void>;

  onDelete: () => void | Promise<void>;

  onUpdateNotes?: (notes: string) => void | Promise<void>;
};

type CategoryExercise = {
  id: string;
  name: string;
  muscleGroup: string | null;
  sets: number;
  reps: string;
  weight: number | null;
};

export default function WorkoutPlanCard({
  plan,
  allExercises,
  onAddExercise,
  onRemoveExercise,
  onDelete,
  onUpdateNotes,
}: Props) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, CategoryExercise[]>();

    plan.exercises.forEach((ex) => {
      const muscle = ex.muscleGroup ?? "ללא שיוך שריר";
      const list = map.get(muscle) ?? [];
      list.push({
        id: ex.id,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
      });
      map.set(muscle, list);
    });

    if (map.size === 0) {
      return [
        {
          muscle: "עדיין אין תרגילים בתוכנית הזו",
          exercises: [] as CategoryExercise[],
        },
      ];
    }

    return Array.from(map.entries()).map(([muscle, exercises]) => ({
      muscle,
      exercises,
    }));
  }, [plan.exercises]);

  return (
    <View
      style={{
        marginTop: 12,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              textAlign: "right",
              color: "#111827",
            }}
          >
            {plan.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#6b7280",
              textAlign: "right",
              marginTop: 2,
            }}
          >
            {plan.exercises.length
              ? `${plan.exercises.length} תרגילים`
              : "אין עדיין תרגילים בתוכנית הזו"}
          </Text>
        </View>

        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            backgroundColor: "#eff6ff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "800", color: "#2563eb" }}>
            {plan.name.slice(0, 2)}
          </Text>
        </View>
      </View>

      {/* Notes */}
      <TextInput
        value={plan.notes ?? ""}
        onChangeText={(t) => onUpdateNotes?.(t)}
        placeholder="הערות לתוכנית אימון"
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#e5e7eb",
          borderRadius: 14,
          padding: 12,
          backgroundColor: "#ffffff",
          textAlign: "right",
          marginBottom: 12,
          minHeight: 46,
        }}
      />

      {/* Categories – ADD BUTTON WORKS */}
      {categories.map((cat) => (
        <WorkoutCategory
          key={cat.muscle}
          group={cat.muscle}
          exercises={cat.exercises}
          onAdd={() => {
            setSelectedMuscle(
              cat.muscle === "ללא שיוך שריר" ? null : cat.muscle
            );
            setAddModalOpen(true);
          }}
          onRemove={(id) => onRemoveExercise(id)}
        />
      ))}

      {/* Footer */}
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <View />
        <Pressable onPress={onDelete}>
          <Text style={{ color: "#dc2626", fontSize: 13, fontWeight: "600" }}>
            מחק תוכנית
          </Text>
        </Pressable>
      </View>

      {/* Add Exercise Modal – CONNECTED */}
      <AddExerciseModal
        visible={addModalOpen}
        exercises={allExercises}
        muscleGroup={selectedMuscle ?? undefined}
        onClose={() => {
          setAddModalOpen(false);
          setSelectedMuscle(null);
        }}
        onSelect={(exercise, meta) => {
          const maxOrder = plan.exercises.reduce(
            (acc, ex) => Math.max(acc, ex.order),
            0
          );

          onAddExercise(exercise, maxOrder, meta);
          setAddModalOpen(false);
          setSelectedMuscle(null);
        }}
      />
    </View>
  );
}
