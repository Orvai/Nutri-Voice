import { useState, useMemo } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import WorkoutSearchBar from "../../workout/WorkoutSearchBar";
import WorkoutFilters from "../../workout/WorkoutFilters";
import WorkoutExerciseGrid from "../../workout/WorkoutExerciseGrid";

const MUSCLE_MAP = {
  חזה: "CHEST",
  גב: "BACK",
  רגליים: "LEGS",
  כתפיים: "SHOULDERS",
  "יד קדמית": "BICEPS",
  "יד אחורית": "TRICEPS",
  הכל: "ALL",
};

export default function AddExerciseModal({
  visible,
  onClose,
  exercises,
  muscleGroup, // מגיע באנגלית: CHEST, BACK...
  onSelect,
}) {
  const [query, setQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState(
    // ממירים EN → HE כדי להתחיל מהקבוצה הרלוונטית
    Object.keys(MUSCLE_MAP).find((k) => MUSCLE_MAP[k] === muscleGroup) || "הכל"
  );

  // סינון לפי שריר
  const filteredByMuscle = useMemo(() => {
    if (selectedMuscle === "הכל") return exercises;
    const translated = MUSCLE_MAP[selectedMuscle];
    return exercises.filter((ex) => ex.muscleGroup === translated);
  }, [exercises, selectedMuscle]);

  // סינון לפי טקסט
  const finalFiltered = useMemo(() => {
    return filteredByMuscle.filter((ex) =>
      ex.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [filteredByMuscle, query]);

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
          בחר תרגיל עבור {selectedMuscle}
        </Text>

        {/* חיפוש */}
        <WorkoutSearchBar query={query} onChange={setQuery} />

        {/* פילטרים */}
        <WorkoutFilters
          selectedMuscle={selectedMuscle}
          onChangeMuscle={setSelectedMuscle}
          totalCount={finalFiltered.length}
        />

        {/* גריד התרגילים */}
        <ScrollView>
          <WorkoutExerciseGrid
            exercises={finalFiltered}
            onPress={(exercise) => {
              onSelect(exercise);
              onClose();
            }}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}
