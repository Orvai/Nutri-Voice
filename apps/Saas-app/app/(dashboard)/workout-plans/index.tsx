import { ScrollView, View, Text, Pressable } from "react-native";
import { useState, useMemo } from "react";

import { useWorkoutTemplates } from "../../../src/hooks/workout/useWorkoutTemplates";
import { useExercises as useWorkoutExercises } from "../../../src/hooks/workout/useExercises";

import WorkoutTemplatesList from "../../../src/components/workout/WorkoutTemplatesList";
import WorkoutExerciseGrid from "../../../src/components/workout/WorkoutExerciseGrid";
import WorkoutSearchBar from "../../../src/components/workout/WorkoutSearchBar";
import WorkoutFilters from "../../../src/components/workout/WorkoutFilters";

export default function WorkoutPlansScreen() {
  const {
    templates,
    isLoading: isLoadingTemplates,
    isFetching: isFetchingTemplates,
    isError: isTemplatesError,
    refetch: refetchTemplates,
  } = useWorkoutTemplates();

  const {
    data: exercises = [],
    isLoading: isLoadingExercises,
    isFetching: isFetchingExercises,
    isError: isExercisesError,
    refetch: refetchExercises,
  } = useWorkoutExercises();

  const [query, setQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("הכל");

  const muscleOptions = useMemo(() => {
    const options = new Set<string>(["הכל"]);
    exercises.forEach((ex) => {
      if (ex.primaryMuscle) options.add(ex.primaryMuscle);
      (ex.secondaryMuscles ?? []).forEach((muscle) => {
        if (muscle) options.add(muscle);
      });
    });
    return Array.from(options);
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    const lowerQuery = query.toLowerCase();

    return exercises.filter((ex) => {
      const name = (ex.name ?? "").toLowerCase();

      const matchQuery = !query || name.includes(lowerQuery);

      const matchMuscle =
        selectedMuscle === "הכל" ||
        ex.primaryMuscle === selectedMuscle ||
        (ex.secondaryMuscles ?? []).includes(selectedMuscle);

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
        isLoading={isLoadingTemplates || isFetchingTemplates}
        isError={isTemplatesError}
        onRetry={refetchTemplates}
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
          muscleOptions={muscleOptions}
          onChangeMuscle={setSelectedMuscle}
          totalCount={filteredExercises.length}
        />

        {/* גריד תרגילים */}
        {isLoadingExercises || isFetchingExercises ? (
          <LoadingGridPlaceholder />
        ) : isExercisesError ? (
          <ErrorState onRetry={refetchExercises} />
        ) : filteredExercises.length === 0 ? (
          <EmptyState />
        ) : (
          <WorkoutExerciseGrid exercises={filteredExercises} />
        )}
      </View>
    </ScrollView>
  );
}

function LoadingGridPlaceholder() {
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 14,
      }}
    >
      {[1, 2, 3, 4].map((index) => (
        <View
          key={index}
          style={{
            width: "48%",
            height: 180,
            borderRadius: 14,
            backgroundColor: "#f3f4f6",
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        />
      ))}
    </View>
  );
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#fecdd3",
        backgroundColor: "#fff1f2",
        padding: 12,
        borderRadius: 12,
        marginTop: 8,
        gap: 8,
      }}
    >
      <Text style={{ textAlign: "right", color: "#b91c1c" }}>
        לא הצלחנו לטעון את ספריית התרגילים.
      </Text>
      <Pressable
        onPress={onRetry}
        style={{
          alignSelf: "flex-start",
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: "#ef4444",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>נסה שוב</Text>
      </Pressable>
    </View>
  );
}

function EmptyState() {
  return (
    <View
      style={{
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      <Text style={{ textAlign: "right", color: "#6b7280" }}>
        אין תרגילים תואמים לחיפוש או לסינון שבחרת.
      </Text>
    </View>
  );
}
