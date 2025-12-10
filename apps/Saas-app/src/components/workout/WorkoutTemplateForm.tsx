import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { UIExercise, UIWorkoutTemplate } from "../../types/ui/workout-ui";
import ExerciseList from "./ExerciseList";
import { theme } from "../../theme";

type ExerciseConfig = {
  exercise: UIExercise;
  sets: string;
  reps: string;
  rest: string;
};

type Props = {
  initialTemplate?: UIWorkoutTemplate | null;
  exercises?: UIExercise[];
  onSubmit?: (payload: {
    name: string;
    workoutType: string;
    level: string;
    bodyType: string;
    gender: string;
    notes: string;
    exercises: ExerciseConfig[];
  }) => void;
  onCancel?: () => void;
};

export default function WorkoutTemplateForm({
  initialTemplate,
  exercises = [],
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialTemplate?.name ?? "");
  const [workoutType, setWorkoutType] = useState(initialTemplate?.workoutType ?? "");
  const [level, setLevel] = useState(String(initialTemplate?.level ?? ""));
  const [bodyType, setBodyType] = useState(initialTemplate?.bodyType ?? "");
  const [gender, setGender] = useState(initialTemplate?.gender ?? "");
  const [notes, setNotes] = useState(initialTemplate?.notes ?? "");
  const [selectedExercises, setSelectedExercises] = useState<ExerciseConfig[]>([]);

  useEffect(() => {
    if (!initialTemplate) return;
    setName(initialTemplate.name ?? "");
    setWorkoutType(initialTemplate.workoutType ?? "");
    setLevel(String(initialTemplate.level ?? ""));
    setBodyType(initialTemplate.bodyType ?? "");
    setGender(initialTemplate.gender ?? "");
    setNotes(initialTemplate.notes ?? "");
  }, [initialTemplate]);

  const exerciseIds = useMemo(() => selectedExercises.map((ex) => ex.exercise.id), [
    selectedExercises,
  ]);

  const handleSelectExercise = (exercise: UIExercise) => {
    setSelectedExercises((prev) => {
      const exists = prev.find((item) => item.exercise.id === exercise.id);
      if (exists) {
        return prev.filter((item) => item.exercise.id !== exercise.id);
      }
      return [...prev, { exercise, sets: "3", reps: "10", rest: "60" }];
    });
  };

  const updateExerciseField = (
    id: string,
    field: keyof Omit<ExerciseConfig, "exercise">,
    value: string
  ) => {
    setSelectedExercises((prev) =>
      prev.map((item) =>
        item.exercise.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleSubmit = () => {
    onSubmit?.({
      name,
      workoutType,
      level,
      bodyType,
      gender,
      notes,
      exercises: selectedExercises,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 12 }}>
      <Text style={styles.heading}>יצירת תבנית אימון</Text>
      <Field label="שם התבנית">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="למשל: תוכנית A"
          style={styles.input}
        />
      </Field>

      <View style={styles.row}>
        <Field label="סוג אימון" style={{ flex: 1 }}>
          <TextInput
            value={workoutType}
            onChangeText={setWorkoutType}
            placeholder="A / FBW / PUSH"
            style={styles.input}
          />
        </Field>
        <Field label="רמה" style={{ flex: 1 }}>
          <TextInput
            value={level}
            onChangeText={setLevel}
            placeholder="1-3"
            style={styles.input}
            keyboardType="numeric"
          />
        </Field>
      </View>

      <View style={styles.row}>
        <Field label="מבנה גוף" style={{ flex: 1 }}>
          <TextInput
            value={bodyType}
            onChangeText={setBodyType}
            placeholder="ECTO / ENDO"
            style={styles.input}
          />
        </Field>
        <Field label="מין" style={{ flex: 1 }}>
          <TextInput
            value={gender}
            onChangeText={setGender}
            placeholder="MALE / FEMALE"
            style={styles.input}
          />
        </Field>
      </View>

      <Field label="הערות">
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="הערות למתאמן"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={3}
        />
      </Field>

      <Field label="בחרו תרגילים">
        <ExerciseList
          exercises={exercises}
          selectedIds={exerciseIds}
          onSelect={handleSelectExercise}
        />
      </Field>

      {selectedExercises.length ? (
        <View style={styles.selectedList}>
          {selectedExercises.map((item) => (
            <View key={item.exercise.id} style={styles.selectedCard}>
              <Text style={styles.selectedTitle}>{item.exercise.name}</Text>
              <View style={styles.row}>
                <TextInput
                  value={item.sets}
                  onChangeText={(value) => updateExerciseField(item.exercise.id, "sets", value)}
                  placeholder="סטים"
                  style={[styles.input, styles.smallInput]}
                  keyboardType="numeric"
                />
                <TextInput
                  value={item.reps}
                  onChangeText={(value) => updateExerciseField(item.exercise.id, "reps", value)}
                  placeholder="חזרות"
                  style={[styles.input, styles.smallInput]}
                  keyboardType="numeric"
                />
                <TextInput
                  value={item.rest}
                  onChangeText={(value) => updateExerciseField(item.exercise.id, "rest", value)}
                  placeholder="מנוחה"
                  style={[styles.input, styles.smallInput]}
                  keyboardType="numeric"
                />
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable onPress={onCancel} style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonTextSecondary}>ביטול</Text>
        </Pressable>
        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>שמור תבנית</Text>
        </Pressable>
      </View>
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
    <View style={[styles.field, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.card.bg,
    borderRadius: theme.card.radius,
    borderWidth: 1,
    borderColor: theme.card.border,
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.text.title,
    textAlign: "right",
  },
  row: {
    flexDirection: "row-reverse",
    gap: 12,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontWeight: "700",
    color: theme.text.title,
    textAlign: "right",
  },
  input: {
    borderWidth: 1,
    borderColor: theme.card.border,
    borderRadius: 12,
    padding: 10,
    textAlign: "right",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  selectedList: {
    gap: 8,
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: theme.card.border,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#f8fafc",
  },
  selectedTitle: {
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 8,
  },
  smallInput: {
    flex: 1,
  },
  actions: {
    flexDirection: "row-reverse",
    gap: 10,
    marginTop: 8,
  },
  button: {
    flex: 1,
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryButton: {
    backgroundColor: "#e2e8f0",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
  },
  buttonTextSecondary: {
    color: theme.text.title,
    textAlign: "center",
    fontWeight: "700",
  },
});
