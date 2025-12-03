import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import WorkoutCategory from "./WorkoutCategory";
import AddExerciseModal from "./AddExerciseModal";
import { useExercisesLibrary } from "../../../hooks/useExercisesLibrary";


export default function WorkoutPlanCard({ plan, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { exercisesLibrary } = useExercisesLibrary(); // MOCK

  const exercisesByGroup = plan.muscleGroups.map((muscle) => ({
    muscle,
    exercises: plan.exercises.filter((ex) => ex.muscleGroup === muscle),
  }));

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 16,
      }}
    >
      <Pressable onPress={() => setOpen((p) => !p)}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>{plan.name}</Text>
      </Pressable>

      {open && (
        <View style={{ marginTop: 16 }}>
          {exercisesByGroup.map((group) => (
            <WorkoutCategory
              key={group.muscle}
              group={group.muscle}
              exercises={group.exercises}
              onAdd={() => {
                setSelectedGroup(group.muscle);
                setModalOpen(true);
              }}
              onRemove={(exerciseId) => {
                const updated = {
                  ...plan,
                  exercises: plan.exercises.filter((e) => e.id !== exerciseId),
                };
                onUpdate(plan.id, updated);
              }}
            />
          ))}

          <Pressable
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              backgroundColor: "#10b981",
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              שמור שינויים
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onDelete(plan.id)}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: "#dc2626", textAlign: "center" }}>
              מחק תוכנית
            </Text>
          </Pressable>
        </View>
      )}

      {/* מודל בחירת תרגיל */}
      <AddExerciseModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        exercises={exercisesLibrary}
        muscleGroup={selectedGroup}
        onSelect={(exercise) => {
          const newEx = {
            id: "ex_" + Math.random().toString(36).slice(2),
            muscleGroup: selectedGroup,
            name: exercise.name,
            sets: 4,
            reps: "12",
            weight: null,
          };

          const updated = {
            ...plan,
            exercises: [...plan.exercises, newEx],
          };

          onUpdate(plan.id, updated);
        }}
      />
    </View>
  );
}
