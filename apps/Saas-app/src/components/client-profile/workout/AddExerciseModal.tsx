import React, { useState, useMemo, useEffect } from "react";
import { Modal, View, Text, Pressable, ScrollView, TextInput } from "react-native";

import type { UIExercise } from "../../../types/ui/workout/exercise.ui";

import WorkoutSearchBar from "../../workout/WorkoutSearchBar";
import WorkoutFilters from "../../workout/WorkoutFilters";
import WorkoutExerciseGrid from "../../workout/WorkoutExerciseGrid";

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
  muscleGroup?: string; // באנגלית: CHEST, BACK...
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

  // דו-שלבי
  const [pickedExercise, setPickedExercise] = useState<UIExercise | null>(null);
  const [setsInput, setSetsInput] = useState("3");
  const [repsInput, setRepsInput] = useState("10");

  useEffect(() => {
    setSelectedMuscle(
      muscleGroup ? MUSCLE_LABELS[muscleGroup] ?? muscleGroup : "הכל"
    );
  }, [muscleGroup]);

  // כשפותחים מחדש מודאל – לאפס את שלב 2
  useEffect(() => {
    if (!visible) return;
    setPickedExercise(null);
    setSetsInput("3");
    setRepsInput("10");
    setQuery("");
  }, [visible]);

  // סינון לפי שריר
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

  // סינון לפי טקסט
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
      <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
        {/* כפתור סגירה */}
        <Pressable onPress={onClose} style={{ marginBottom: 10 }}>
          <Text style={{ textAlign: "right", color: "#2563eb", fontSize: 16 }}>
            ✕ סגור
          </Text>
        </Pressable>

        {/* כותרת */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 16,
            textAlign: "right",
          }}
        >
          {pickedExercise ? "הגדר סטים וחזרות" : `בחר תרגיל עבור ${selectedMuscle}`}
        </Text>

        {/* שלב 2: סטים/חזרות */}
        {pickedExercise ? (
          <View style={{ gap: 12 }}>
            <View
              style={{
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                backgroundColor: "#f9fafb",
              }}
            >
              <Text style={{ textAlign: "right", fontWeight: "800", color: "#111827" }}>
                {pickedExercise.name}
              </Text>
              <Text style={{ textAlign: "right", color: "#6b7280", marginTop: 2, fontSize: 12 }}>
                {MUSCLE_LABELS[pickedExercise.muscleGroup] ?? pickedExercise.muscleGroup}
              </Text>
            </View>

            <View style={{ flexDirection: "row-reverse", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ textAlign: "right", color: "#111827", marginBottom: 6 }}>
                  סטים
                </Text>
                <TextInput
                  value={setsInput}
                  onChangeText={setSetsInput}
                  keyboardType="number-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    textAlign: "right",
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ textAlign: "right", color: "#111827", marginBottom: 6 }}>
                  חזרות
                </Text>
                <TextInput
                  value={repsInput}
                  onChangeText={setRepsInput}
                  placeholder="למשל 10 או 8-12"
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    textAlign: "right",
                  }}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row-reverse", gap: 10, marginTop: 8 }}>
              <Pressable
                onPress={() => setPickedExercise(null)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "#ffffff",
                }}
              >
                <Text style={{ color: "#111827", fontWeight: "700" }}>חזור לבחירה</Text>
              </Pressable>

              <Pressable
                onPress={handleConfirm}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  backgroundColor: "#2563eb",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#ffffff", fontWeight: "800" }}>הוסף</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            {/* חיפוש */}
            <WorkoutSearchBar query={query} onChange={setQuery} />

            {/* פילטרים */}
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

            {/* גריד התרגילים */}
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
