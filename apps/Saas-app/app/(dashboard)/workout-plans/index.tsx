import { ScrollView, View, Text } from "react-native";
import { useState, useMemo } from "react";

import { useWorkoutTemplates } from "../../../src/hooks/useWorkoutTemplates";
import { useExercises } from "../../../src/hooks/useExercises";

import WorkoutTemplatesList from "../../../src/components/workout/WorkoutTemplatesList";
import WorkoutExerciseGrid from "../../../src/components/workout/WorkoutExerciseGrid";
import WorkoutSearchBar from "../../../src/components/workout/WorkoutSearchBar";
import WorkoutFilters from "../../../src/components/workout/WorkoutFilters";

export default function WorkoutPlansScreen() {
  const { templates } = useWorkoutTemplates();
  const { exercises } = useExercises();

  const [query, setQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("הכל");

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchQuery =
        !query ||
        ex.name.toLowerCase().includes(query.toLowerCase());
      const matchMuscle =
        selectedMuscle === "הכל" ||
        ex.muscleGroup === selectedMuscle;

      return matchQuery && matchMuscle;
    });
  }, [exercises, query, selectedMuscle]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f3f4f6" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* תבניות אימון */}
      <WorkoutTemplatesList
        templates={templates}
        onCreateNew={() => {
          // בעתיד: navigate ליצירת תבנית אימון חדשה
          console.log("create new template");
        }}
      />

      {/* ספריית תרגילים */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 8,
          }}
        >
          ספריית תרגילים (Exercise Library)
        </Text>

        {/* חיפוש */}
        <WorkoutSearchBar query={query} onChange={setQuery} />

        {/* פילטרים */}
        <WorkoutFilters
          selectedMuscle={selectedMuscle}
          onChangeMuscle={setSelectedMuscle}
          totalCount={filteredExercises.length}
        />

        {/* גריד תרגילים */}
        <WorkoutExerciseGrid exercises={filteredExercises} />
      </View>
    </ScrollView>
  );
}
