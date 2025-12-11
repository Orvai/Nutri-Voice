// apps/Saas-app/src/components/client-profile/workout/WorkoutPlanCard.tsx

import { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import type {
  UIWorkoutProgram,
  UIExercise,
} from "../../../types/ui/workout-ui";
import WorkoutCategory from "./WorkoutCategory";
import AddExerciseModal from "./AddExerciseModal";

type Props = {
  plan: UIWorkoutProgram;
  allExercises: UIExercise[];
  onAddExercise: (exercise: UIExercise, orderHint?: number) => void | Promise<void>;
  onRemoveExercise: (workoutExerciseId: string) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
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
}: Props) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, CategoryExercise[]>();

    (plan.exercises ?? []).forEach((ex) => {
      const muscle = ex.exercise.muscleGroup ?? "ללא שיוך שריר";
      const list = map.get(muscle) ?? [];
      list.push({
        id: ex.id,
        name: ex.exercise.name,
        muscleGroup: ex.exercise.muscleGroup,
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

  const handleOpenAddForMuscle = (muscle: string | null) => {
    setSelectedMuscle(muscle);
    setAddModalOpen(true);
  };

  const handleSelectExercise = async (exercise: UIExercise) => {
    const maxOrder = (plan.exercises ?? []).reduce(
      (acc, ex) => Math.max(acc, ex.order ?? 0),
      0
    );
    await onAddExercise(exercise, maxOrder);
  };

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
      {/* כותרת התוכנית */}
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

      {/* קטגוריות תרגילים */}
      <ScrollView
        style={{ maxHeight: 420 }}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {categories.map((cat) => (
          <WorkoutCategory
            key={cat.muscle}
            group={cat.muscle}
            exercises={cat.exercises}
            onAdd={() =>
              handleOpenAddForMuscle(cat.muscle === "ללא שיוך שריר" ? null : cat.muscle)
            }
            onRemove={(id) => onRemoveExercise(id)}
          />
        ))}
      </ScrollView>

      {/* פעולות תחתונות */}
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <Pressable
          onPress={() => handleOpenAddForMuscle(null)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 999,
            backgroundColor: "#eff6ff",
          }}
        >
          <Text style={{ color: "#2563eb", fontWeight: "700", fontSize: 13 }}>
            + הוסף תרגיל
          </Text>
        </Pressable>

        <Pressable onPress={onDelete}>
          <Text style={{ color: "#dc2626", fontSize: 13, fontWeight: "600" }}>
            מחק תוכנית
          </Text>
        </Pressable>
      </View>

      {/* מודל הוספת תרגיל */}
      <AddExerciseModal
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        exercises={allExercises}
        muscleGroup={selectedMuscle ?? undefined}
        onSelect={handleSelectExercise}
      />
    </View>
  );
}
