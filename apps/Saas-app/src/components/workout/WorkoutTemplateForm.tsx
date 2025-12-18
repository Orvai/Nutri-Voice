import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import type { UIWorkoutTemplate } from "@/types/ui/workout/workoutTemplate.ui";
import type { UIExercise } from "@/types/ui/workout/exercise.ui";

import {
  WorkoutTemplateCreateRequestDto,
  WorkoutTemplateCreateRequestDtoGender,
  WorkoutTemplateCreateRequestDtoBodyType,
} from "@common/api/sdk/schemas";

import { MUSCLE_LABEL_TO_ENUM } from "@/mappers/workout/workoutEnumMapper";

import { theme } from "../../theme";
import { Chip } from "./common/Chip";
import { styles } from "./styles/WorkoutTemplateForm.styles";

/* ======================
   Constants
====================== */

const DEFAULT_MUSCLE_GROUPS = [
  "חזה",
  "גב",
  "כתפיים",
  "רגליים",
  "ישבן",
  "יד_קדמית",
  "יד_אחורית",
  "בטן",
];

const GENDER_OPTIONS: WorkoutTemplateCreateRequestDtoGender[] = [
  "MALE",
  "FEMALE",
];

const BODY_TYPE_OPTIONS: WorkoutTemplateCreateRequestDtoBodyType[] = [
  "ECTO",
  "ENDO",
];

const WORKOUT_TYPE_OPTIONS: {
  value: WorkoutTemplateCreateRequestDto["workoutType"];
  label: string;
}[] = [
  { value: "A", label: "A – כללי" },
  { value: "B", label: "B – כללי" },
  { value: "FBW", label: "אימון גוף מלא" },
  { value: "UPPER", label: "פלג גוף עליון" },
  { value: "LOWER", label: "פלג גוף תחתון" },
  { value: "GLUTES", label: "ישבן" },
  { value: "HIIT", label: "HIIT" },
  { value: "PUSH", label: "Push – דחיפה" },
  { value: "PULL", label: "Pull – משיכה" },
  { value: "LEGS", label: "רגליים" },
];

/* ======================
   Helpers
====================== */

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function normalizeMuscle(value?: string | null) {
  return (value ?? "").trim();
}

/* ======================
   Props
====================== */

type Props = {
  initialTemplate?: UIWorkoutTemplate | null;
  exercises?: UIExercise[];
  onSubmit: (payload: WorkoutTemplateCreateRequestDto) => void;
  onCancel?: () => void;
};

/* ======================
   Component
====================== */

export default function WorkoutTemplateForm({
  initialTemplate,
  exercises = [],
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState<string | null>(null);
  const [workoutType, setWorkoutType] =
    useState<WorkoutTemplateCreateRequestDto["workoutType"] | "">("");
  const [level, setLevel] = useState("");

  const [gender, setGender] =
    useState<WorkoutTemplateCreateRequestDtoGender | null>(null);

  const [bodyType, setBodyType] =
    useState<WorkoutTemplateCreateRequestDtoBodyType | null>(null);

  const [notes, setNotes] = useState<string | null>(null);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);

  /* ======================
     Init edit
  ====================== */

  useEffect(() => {
    if (!initialTemplate) return;

    setName(initialTemplate.name ?? null);
    setWorkoutType(initialTemplate.workoutType ?? "");
    setLevel(String(initialTemplate.level ?? ""));
    setGender(initialTemplate.gender as WorkoutTemplateCreateRequestDtoGender);
    setBodyType(
      initialTemplate.bodyType as WorkoutTemplateCreateRequestDtoBodyType
    );
    setNotes(initialTemplate.notes ?? null);
    setSelectedMuscleGroups(uniq(initialTemplate.muscleGroups ?? []));
  }, [initialTemplate]);

  /* ======================
     Derived
  ====================== */

  const allMuscleOptions = useMemo(() => {
    const fromLib = exercises
      .map((e) => normalizeMuscle(e.muscleGroup))
      .filter(Boolean);

    return uniq(fromLib.length ? fromLib : DEFAULT_MUSCLE_GROUPS);
  }, [exercises]);

  const isValid =
    gender !== null &&
    workoutType !== "" &&
    Number(level) > 0 &&
    selectedMuscleGroups.length > 0;

  /* ======================
     Submit
  ====================== */

  const handleSubmit = () => {
    if (!isValid || !gender || workoutType === "") return;

    const mappedMuscles = uniq(selectedMuscleGroups).map((label) => {
      const mapped = MUSCLE_LABEL_TO_ENUM[label];
      if (!mapped) {
        throw new Error(`Unknown muscle label: ${label}`);
      }
      return mapped;
    });

    onSubmit({
      gender,
      workoutType,
      level: Number(level),
      muscleGroups: mappedMuscles,
      bodyType: bodyType ?? undefined,
      name: name ?? undefined,
      notes: notes ?? null,
    });
  };

  /* ======================
     Render
  ====================== */

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 16 }}>
      <Field label="שם התבנית (רשות)">
        <TextInput
          value={name ?? ""}
          onChangeText={(v) => setName(v || null)}
          style={[
            styles.input,
            { borderColor: theme.card.border },
          ]}
        />
      </Field>

      <Field label="סוג אימון *">
        <View style={styles.optionsWrap}>
          {WORKOUT_TYPE_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setWorkoutType(opt.value)}
            >
              <Chip
                label={opt.label}
                tone={workoutType === opt.value ? "accent" : "gray"}
              />
            </Pressable>
          ))}
        </View>
      </Field>

      <Field label="רמה *">
        <TextInput
          value={level}
          onChangeText={setLevel}
          keyboardType="numeric"
          style={[
            styles.input,
            { borderColor: theme.card.border },
          ]}
        />
      </Field>

      <Field label="מין *">
        <View style={styles.optionsWrap}>
          {GENDER_OPTIONS.map((g) => (
            <Pressable key={g} onPress={() => setGender(g)}>
              <Chip label={g} tone={gender === g ? "accent" : "gray"} />
            </Pressable>
          ))}
        </View>
      </Field>

      <Field label="מבנה גוף (רשות)">
        <View style={styles.optionsWrap}>
          {BODY_TYPE_OPTIONS.map((b) => (
            <Pressable key={b} onPress={() => setBodyType(b)}>
              <Chip label={b} tone={bodyType === b ? "accent" : "gray"} />
            </Pressable>
          ))}
        </View>
      </Field>

      <Field label="קבוצות שרירים *">
        <View style={styles.musclesWrap}>
          {allMuscleOptions.map((m) => {
            const active = selectedMuscleGroups.includes(m);
            return (
              <Pressable
                key={m}
                onPress={() =>
                  setSelectedMuscleGroups((prev) =>
                    prev.includes(m)
                      ? prev.filter((x) => x !== m)
                      : [...prev, m]
                  )
                }
              >
                <Chip label={m} tone={active ? "accent" : "gray"} />
              </Pressable>
            );
          })}
        </View>
      </Field>

      <Field label="הערות (רשות)">
        <TextInput
          value={notes ?? ""}
          onChangeText={(v) => setNotes(v || null)}
          multiline
          style={[
            styles.input,
            styles.textArea,
            { borderColor: theme.card.border },
          ]}
        />
      </Field>

      <View style={styles.actions}>
        <Pressable onPress={onCancel} style={styles.secondaryBtn}>
          <Text>ביטול</Text>
        </Pressable>

        <Pressable
          onPress={handleSubmit}
          disabled={!isValid}
          style={[
            styles.primaryBtn,
            !isValid && styles.primaryBtnDisabled,
          ]}
        >
          <Text style={styles.primaryText}>שמור תבנית</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

/* ======================
   UI Helpers
====================== */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}
