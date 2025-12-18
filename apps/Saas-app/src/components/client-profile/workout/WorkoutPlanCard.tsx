import React, { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";

import type { UIWorkoutProgram } from "../../../types/ui/workout/workoutProgram.ui";
import type { UIExercise } from "../../../types/ui/workout/exercise.ui";

import WorkoutCategory from "./WorkoutCategory";
import AddExerciseModal from "./AddExerciseModal";
import { styles } from "../styles/WorkoutPlanCard.styles";

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{plan.name}</Text>
          <Text style={styles.subtitle}>
            {plan.exercises.length
              ? `${plan.exercises.length} תרגילים`
              : "אין עדיין תרגילים בתוכנית הזו"}
          </Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
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
        style={styles.notes}
      />

      {/* Categories */}
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
      <View style={styles.footer}>
        <View />
        <Pressable onPress={onDelete}>
          <Text style={styles.deleteText}>מחק תוכנית</Text>
        </Pressable>
      </View>

      {/* Add Exercise Modal */}
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
