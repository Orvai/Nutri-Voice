import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import type { UIWorkoutProgram, UIExercise } from "../../types/ui/workout-ui";
import type { CreateWorkoutProgramPayload } from "../../types/api/workout-types/workoutProgram.types";
import ExerciseList from "./ExerciseList";

interface Props {
  initialProgram?: UIWorkoutProgram;
  exercises: UIExercise[];
  onSubmit: (payload: CreateWorkoutProgramPayload) => void;
  isSubmitting?: boolean;
}

export default function WorkoutProgramForm({
  initialProgram,
  exercises,
  onSubmit,
  isSubmitting,
}: Props) {
  const [name, setName] = useState(initialProgram?.name ?? "");
  const [goal, setGoal] = useState(initialProgram?.goal ?? "");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    initialProgram?.level ?? "intermediate"
  );
  const [durationWeeks, setDurationWeeks] = useState(
    initialProgram?.durationWeeks?.toString() ?? ""
  );
  const [sessionsPerWeek, setSessionsPerWeek] = useState(
    initialProgram?.sessionsPerWeek?.toString() ?? ""
  );
  const [notes, setNotes] = useState(initialProgram?.notes ?? "");
  const [selectedExercises, setSelectedExercises] = useState<UIExercise[]>(
    initialProgram?.exercises.map((ex) => ex.exercise) ?? []
  );

  useEffect(() => {
    if (!initialProgram) return;

    setName(initialProgram.name ?? "");
    setGoal(initialProgram.goal ?? "");
    setLevel(initialProgram.level ?? "intermediate");
    setDurationWeeks(initialProgram.durationWeeks?.toString() ?? "");
    setSessionsPerWeek(initialProgram.sessionsPerWeek?.toString() ?? "");
    setNotes(initialProgram.notes ?? "");
    setSelectedExercises(initialProgram.exercises.map((ex) => ex.exercise));
  }, [initialProgram]);

  const sortedExercises = useMemo(
    () =>
      [...selectedExercises].sort((a, b) => a.name.localeCompare(b.name, "he")),
    [selectedExercises]
  );

  const handleSelectExercise = (exercise: UIExercise) => {
    setSelectedExercises((prev) => {
      const exists = prev.some((ex) => ex.id === exercise.id);
      if (exists) {
        return prev.filter((ex) => ex.id !== exercise.id);
      }
      return [...prev, exercise];
    });
  };

  const handleSubmit = () => {
    const payload: CreateWorkoutProgramPayload = {
      name: name.trim(),
      goal: goal.trim() || null,
      level,
      durationWeeks: durationWeeks ? Number(durationWeeks) : null,
      sessionsPerWeek: sessionsPerWeek ? Number(sessionsPerWeek) : null,
      notes: notes.trim() || null,
      exercises: selectedExercises.map((exercise, index) => ({
        exerciseId: exercise.id,
        sets: 3,
        reps: 12,
        restSeconds: 60,
        order: index + 1,
      })),
    };

    onSubmit(payload);
  };

  return (
    <ScrollView contentContainerStyle={{ gap: 12 }}>
      <Field label="שם התוכנית">
        <TextInput
          placeholder="למשל: כוח עליון"
          value={name}
          onChangeText={setName}
          style={inputStyle}
        />
      </Field>

      <Field label="מטרה">
        <TextInput
          placeholder="היפרטרופיה / כוח / חיטוב"
          value={goal}
          onChangeText={setGoal}
          style={inputStyle}
        />
      </Field>

      <Field label="רמת מתאמן">
        <View style={{ flexDirection: "row-reverse", gap: 8 }}>
          {(
            [
              { value: "beginner", label: "מתחיל" },
              { value: "intermediate", label: "ביניים" },
              { value: "advanced", label: "מתקדם" },
            ] as const
          ).map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setLevel(option.value)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: level === option.value ? "#22c55e" : "#e5e7eb",
                backgroundColor: level === option.value ? "#dcfce7" : "#fff",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#0f172a" }}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Field>

      <View style={{ flexDirection: "row-reverse", gap: 12 }}>
        <Field label="משך (שבועות)" style={{ flex: 1 }}>
          <TextInput
            keyboardType="numeric"
            value={durationWeeks}
            onChangeText={setDurationWeeks}
            placeholder="8"
            style={inputStyle}
          />
        </Field>
        <Field label="אימונים בשבוע" style={{ flex: 1 }}>
          <TextInput
            keyboardType="numeric"
            value={sessionsPerWeek}
            onChangeText={setSessionsPerWeek}
            placeholder="4"
            style={inputStyle}
          />
        </Field>
      </View>

      <Field label="הערות">
        <TextInput
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
          placeholder="הנחיות טכניות, RPE, טמפו ועוד"
          style={[inputStyle, { height: 80, textAlignVertical: "top" }]}
        />
      </Field>

      <Field label="בחר תרגילים">
        <ExerciseList
          exercises={exercises}
          selectedIds={selectedExercises.map((ex) => ex.id)}
          onSelect={handleSelectExercise}
        />
      </Field>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "700", fontSize: 16 }}>תרגילים בתוכנית</Text>
        {sortedExercises.length === 0 ? (
          <Text style={{ color: "#6b7280" }}>לא נבחרו תרגילים</Text>
        ) : (
          sortedExercises.map((exercise, index) => (
            <View
              key={exercise.id}
              style={{
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                padding: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                backgroundColor: "#f8fafc",
              }}
            >
              <Text style={{ fontWeight: "700" }}>
                {index + 1}. {exercise.name}
              </Text>
              <Text style={{ color: "#6b7280" }}>
                {exercise.muscleGroup || "ללא שריר"}
              </Text>
            </View>
          ))
        )}
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={{
          backgroundColor: isSubmitting ? "#9ca3af" : "#22c55e",
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 8,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "800" }}>
          {isSubmitting ? "שומר..." : "שמור תוכנית"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <View style={[{ gap: 6 }, style]}>
      <Text style={{ fontWeight: "800", fontSize: 14 }}>{label}</Text>
      {children}
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: "#d1d5db",
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  textAlign: "right" as const,
  backgroundColor: "#fff",
};