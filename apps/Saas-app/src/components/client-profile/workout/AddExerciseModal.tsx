import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";

import type { UIExercise } from "../../../types/ui/workout/exercise.ui";

import WorkoutSearchBar from "../../workout/WorkoutSearchBar";
import WorkoutFilters from "../../workout/WorkoutFilters";
import WorkoutExerciseGrid from "../../workout/WorkoutExerciseGrid";
import { styles } from "../styles/AddExerciseModal.styles";

const MUSCLE_MAP: Record<string, string> = {
  חזה: "CHEST",
  גב: "BACK",
  רגליים: "LEGS",
  כתפיים: "SHOULDERS",
  "יד קדמית": "BICEPS",
  "יד אחורית": "TRICEPS",
  ישבן: "GLUTES",
  בטן: "ABS",
  הכל: "ALL",
};

const MUSCLE_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(MUSCLE_MAP).map(([label, value]) => [value, label])
);

type Props = {
  visible: boolean;
  onClose: () => void;
  exercises: UIExercise[];
  muscleGroup?: string;
  onSelect: (exercise: UIExercise, meta: { sets: number; reps: string }) => void;
};

export default function AddExerciseModal({
  visible,
  onClose,
  exercises,
  muscleGroup,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState(
    muscleGroup ? MUSCLE_LABELS[muscleGroup] ?? muscleGroup : "הכל"
  );

  const [pickedExercise, setPickedExercise] = useState<UIExercise | null>(null);
  const [setsInput, setSetsInput] = useState("3");
  const [repsInput, setRepsInput] = useState("10");

  useEffect(() => {
    setSelectedMuscle(
      muscleGroup ? MUSCLE_LABELS[muscleGroup] ?? muscleGroup : "הכל"
    );
  }, [muscleGroup]);

  useEffect(() => {
    if (!visible) return;
    setPickedExercise(null);
    setSetsInput("3");
    setRepsInput("10");
    setQuery("");
  }, [visible]);

  const filteredByMuscle = useMemo(() => {
    if (muscleGroup) {
      return exercises.filter((ex) => ex.muscleGroup === muscleGroup);
    }

    if (selectedMuscle === "הכל") return exercises;
    const translated = MUSCLE_MAP[selectedMuscle];
    return translated
      ? exercises.filter((ex) => ex.muscleGroup === translated)
      : exercises;
  }, [exercises, muscleGroup, selectedMuscle]);

  const finalFiltered = useMemo(() => {
    return filteredByMuscle.filter((ex) =>
      ex.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [filteredByMuscle, query]);

  const handleConfirm = () => {
    if (!pickedExercise) return;

    const parsedSets = parseInt(setsInput, 10);
    const sets = Number.isFinite(parsedSets) && parsedSets > 0 ? parsedSets : 3;
    const reps = (repsInput ?? "").trim() || "10";

    onSelect(pickedExercise, { sets, reps });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Pressable onPress={onClose} style={styles.close}>
          <Text style={styles.closeText}>✕ סגור</Text>
        </Pressable>

        <Text style={styles.title}>
          {pickedExercise
            ? "הגדר סטים וחזרות"
            : `בחר תרגיל עבור ${selectedMuscle}`}
        </Text>

        {pickedExercise ? (
          <View style={{ gap: 12 }}>
            <View style={styles.pickedCard}>
              <Text style={styles.pickedName}>{pickedExercise.name}</Text>
              <Text style={styles.pickedMuscle}>
                {MUSCLE_LABELS[pickedExercise.muscleGroup] ??
                  pickedExercise.muscleGroup}
              </Text>
            </View>

            <View style={styles.inputsRow}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>סטים</Text>
                <TextInput
                  value={setsInput}
                  onChangeText={setSetsInput}
                  keyboardType="number-pad"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>חזרות</Text>
                <TextInput
                  value={repsInput}
                  onChangeText={setRepsInput}
                  placeholder="למשל 10 או 8-12"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={() => setPickedExercise(null)}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>חזור לבחירה</Text>
              </Pressable>

              <Pressable
                onPress={handleConfirm}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>הוסף</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <WorkoutSearchBar query={query} onChange={setQuery} />

            <WorkoutFilters
              selectedMuscle={selectedMuscle}
              muscleOptions={
                muscleGroup
                  ? [MUSCLE_LABELS[muscleGroup] ?? muscleGroup]
                  : undefined
              }
              onChangeMuscle={setSelectedMuscle}
              totalCount={finalFiltered.length}
            />

            <ScrollView>
              <WorkoutExerciseGrid
                exercises={finalFiltered}
                onPress={(exercise: UIExercise) => {
                  setPickedExercise(exercise);
                }}
              />
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
}
