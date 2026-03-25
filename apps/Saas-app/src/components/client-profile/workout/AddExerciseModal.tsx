import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";

import type { UIExercise } from "../../../types/ui/workout/exercise.ui";
import type { ExerciseCreateRequestDto } from "@common/api/sdk/schemas";
import {
  CANONICAL_MUSCLE_GROUP_VALUES,
  normalizeMuscleGroup,
} from "@/mappers/workout/workoutEnumMapper";

import WorkoutSearchBar from "../../workout/WorkoutSearchBar";
import WorkoutFilters from "../../workout/WorkoutFilters";
import WorkoutExerciseGrid from "../../workout/WorkoutExerciseGrid";
import { styles } from "./styles/AddExerciseModal.styles";

const ALL_MUSCLES = "הכל";

type Props = {
  visible: boolean;
  onClose: () => void;
  exercises: UIExercise[];
  muscleGroup?: string;
  onCreateExercise: (payload: ExerciseCreateRequestDto) => Promise<UIExercise>;
  onSelect: (exercise: UIExercise, meta: { sets: number; reps: string }) => void;
};

const toErrorMessage = (error: unknown) => {
  const maybeError = error as {
    response?: { data?: { error?: { message?: string }; message?: string } };
    message?: string;
  };

  return (
    maybeError?.response?.data?.error?.message ||
    maybeError?.response?.data?.message ||
    maybeError?.message ||
    "לא הצלחנו להוסיף תרגיל. נסה שוב."
  );
};

export default function AddExerciseModal({
  visible,
  onClose,
  exercises,
  muscleGroup,
  onCreateExercise,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState(
    muscleGroup ? normalizeMuscleGroup(muscleGroup) : ALL_MUSCLES
  );
  const [isCreateMode, setIsCreateMode] = useState(false);

  const [pickedExercise, setPickedExercise] = useState<UIExercise | null>(null);
  const [setsInput, setSetsInput] = useState("3");
  const [repsInput, setRepsInput] = useState("10");
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseMuscle, setNewExerciseMuscle] = useState("");
  const [newExerciseEquipment, setNewExerciseEquipment] = useState("");
  const [newExerciseDescription, setNewExerciseDescription] = useState("");
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);

  const muscleOptions = useMemo(() => {
    const values = new Set<string>(CANONICAL_MUSCLE_GROUP_VALUES);

    if (muscleGroup) {
      const normalizedGroup = normalizeMuscleGroup(muscleGroup);
      if (normalizedGroup) values.add(normalizedGroup);
    }

    exercises.forEach((exercise) => {
      const normalized = normalizeMuscleGroup(exercise.muscleGroup);
      if (normalized) values.add(normalized);
    });

    return Array.from(values);
  }, [exercises, muscleGroup]);

  const existingNames = useMemo(
    () =>
      new Set(
        exercises
          .map((exercise) => exercise.name.trim().toLocaleLowerCase("he"))
          .filter(Boolean)
      ),
    [exercises]
  );

  const newExerciseNameTrimmed = newExerciseName.trim();
  const newNameAlreadyExists = useMemo(
    () =>
      Boolean(newExerciseNameTrimmed) &&
      existingNames.has(newExerciseNameTrimmed.toLocaleLowerCase("he")),
    [existingNames, newExerciseNameTrimmed]
  );

  useEffect(() => {
    setSelectedMuscle(
      muscleGroup ? normalizeMuscleGroup(muscleGroup) : ALL_MUSCLES
    );
  }, [muscleGroup]);

  useEffect(() => {
    if (!visible) return;
    setPickedExercise(null);
    setIsCreateMode(false);
    setSetsInput("3");
    setRepsInput("10");
    setQuery("");
    setNewExerciseName("");
    setNewExerciseEquipment("");
    setNewExerciseDescription("");
    setNewExerciseMuscle(
      muscleGroup
        ? normalizeMuscleGroup(muscleGroup) || CANONICAL_MUSCLE_GROUP_VALUES[0]
        : CANONICAL_MUSCLE_GROUP_VALUES[0]
    );
  }, [visible, muscleGroup]);

  const filteredByMuscle = useMemo(() => {
    const normalizedSelectedGroup = normalizeMuscleGroup(muscleGroup);

    if (muscleGroup) {
      return exercises.filter(
        (ex) => normalizeMuscleGroup(ex.muscleGroup) === normalizedSelectedGroup
      );
    }

    if (selectedMuscle === ALL_MUSCLES) return exercises;
    return exercises.filter(
      (ex) => normalizeMuscleGroup(ex.muscleGroup) === selectedMuscle
    );
  }, [exercises, muscleGroup, selectedMuscle]);

  const finalFiltered = useMemo(() => {
    const normalizedQuery = query.toLocaleLowerCase("he");
    return filteredByMuscle.filter((ex) =>
      ex.name.toLocaleLowerCase("he").includes(normalizedQuery)
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

  const openCreateMode = () => {
    const fallbackMuscle =
      selectedMuscle !== ALL_MUSCLES
        ? selectedMuscle
        : muscleGroup
          ? normalizeMuscleGroup(muscleGroup)
          : CANONICAL_MUSCLE_GROUP_VALUES[0];

    setIsCreateMode(true);
    setNewExerciseName(query.trim());
    setNewExerciseEquipment("");
    setNewExerciseDescription("");
    setNewExerciseMuscle(fallbackMuscle);
  };

  const handleCreateExercise = async () => {
    if (!newExerciseNameTrimmed || newExerciseNameTrimmed.length < 2) {
      Alert.alert("שגיאה", "יש להזין שם תרגיל של לפחות 2 תווים.");
      return;
    }

    if (!newExerciseMuscle) {
      Alert.alert("שגיאה", "יש לבחור קבוצת שריר.");
      return;
    }

    if (newNameAlreadyExists) {
      Alert.alert("שגיאה", "תרגיל בשם הזה כבר קיים בספרייה.");
      return;
    }

    try {
      setIsCreatingExercise(true);

      const payload: ExerciseCreateRequestDto = {
        name: newExerciseNameTrimmed,
        muscleGroup: normalizeMuscleGroup(
          newExerciseMuscle
        ) as ExerciseCreateRequestDto["muscleGroup"],
        equipment: newExerciseEquipment.trim() || undefined,
        description: newExerciseDescription.trim() || undefined,
      };

      const createdExercise = await onCreateExercise(payload);
      setPickedExercise(createdExercise);
      setSelectedMuscle(normalizeMuscleGroup(createdExercise.muscleGroup));
      setIsCreateMode(false);
      setQuery(createdExercise.name);
    } catch (error) {
      Alert.alert("שגיאה", toErrorMessage(error));
    } finally {
      setIsCreatingExercise(false);
    }
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
            : isCreateMode
              ? "הוסף תרגיל חדש לספרייה"
              : `בחר תרגיל עבור ${selectedMuscle}`}
        </Text>

        {pickedExercise ? (
          <View style={{ gap: 12 }}>
            <View style={styles.pickedCard}>
              <Text style={styles.pickedName}>{pickedExercise.name}</Text>
              <Text style={styles.pickedMuscle}>
                {normalizeMuscleGroup(pickedExercise.muscleGroup)}
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
        ) : isCreateMode ? (
          <View style={styles.createWrapper}>
            <TextInput
              value={newExerciseName}
              onChangeText={setNewExerciseName}
              placeholder="שם התרגיל"
              style={styles.input}
              textAlign="right"
            />

            <Text style={styles.label}>קבוצת שריר *</Text>
            <View style={styles.muscleOptions}>
              {muscleOptions.map((muscle) => {
                const active = newExerciseMuscle === muscle;
                return (
                  <Pressable
                    key={muscle}
                    onPress={() => setNewExerciseMuscle(muscle)}
                    style={[
                      styles.muscleChip,
                      active && styles.muscleChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.muscleChipText,
                        active && styles.muscleChipTextActive,
                      ]}
                    >
                      {muscle}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              value={newExerciseEquipment}
              onChangeText={setNewExerciseEquipment}
              placeholder="ציוד (אופציונלי)"
              style={styles.input}
              textAlign="right"
            />

            <TextInput
              value={newExerciseDescription}
              onChangeText={setNewExerciseDescription}
              placeholder="תיאור קצר (אופציונלי)"
              multiline
              style={[styles.input, styles.textArea]}
              textAlign="right"
            />

            {newNameAlreadyExists ? (
              <Text style={styles.errorText}>
                תרגיל בשם הזה כבר קיים בספרייה
              </Text>
            ) : null}

            <View style={styles.actions}>
              <Pressable
                onPress={() => setIsCreateMode(false)}
                style={styles.backButton}
                disabled={isCreatingExercise}
              >
                <Text style={styles.backButtonText}>חזור לבחירה</Text>
              </Pressable>

              <Pressable
                onPress={handleCreateExercise}
                style={[
                  styles.confirmButton,
                  (isCreatingExercise || newNameAlreadyExists) &&
                    styles.confirmButtonDisabled,
                ]}
                disabled={isCreatingExercise || newNameAlreadyExists}
              >
                {isCreatingExercise ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.confirmButtonText}>שמור תרגיל</Text>
                )}
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <WorkoutSearchBar
              value={query}
              onChange={setQuery}
              placeholder="חפש תרגיל"
            />

            <Pressable onPress={openCreateMode} style={styles.createButton}>
              <Text style={styles.createButtonText}>
                {query.trim()
                  ? `+ הוסף "${query.trim()}" כתרגיל חדש`
                  : "+ הוסף תרגיל חדש לספרייה"}
              </Text>
            </Pressable>

            <WorkoutFilters
              selectedMuscle={selectedMuscle}
              muscleOptions={
                muscleGroup
                  ? [normalizeMuscleGroup(muscleGroup)]
                  : undefined
              }
              onChangeMuscle={setSelectedMuscle}
              totalCount={finalFiltered.length}
            />

            <ScrollView>
              <WorkoutExerciseGrid
                exercises={finalFiltered}
                showMediaActions={false}
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
