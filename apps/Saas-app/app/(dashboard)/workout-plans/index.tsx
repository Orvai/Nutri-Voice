import { ScrollView, View, Text, Pressable, Modal, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState, useMemo } from "react";
import type { ExerciseCreateRequestDto } from "@common/api/sdk/schemas";

import { useWorkoutTemplates } from "@/hooks/workout/workoutTemplate/useWorkoutTemplates";
import { useExercises } from "@/hooks/workout/exercise/useExercises";
import { useCreateExercise } from "@/hooks/workout/exercise/useCreateExercise";
import { CANONICAL_MUSCLE_GROUP_VALUES } from "@/mappers/workout/workoutEnumMapper";

import WorkoutTemplatesList from "@/components/workout/WorkoutTemplatesList";
import WorkoutExerciseGrid from "@/components/workout/WorkoutExerciseGrid";
import WorkoutSearchBar from "@/components/workout/WorkoutSearchBar";
import WorkoutFilters from "@/components/workout/WorkoutFilters";

const ALL_MUSCLE_OPTION = "הכל";

function toErrorMessage(error: unknown) {
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
}

export default function WorkoutPlansScreen() {
  /* =========================
     DATA
  ========================= */

  const {
    templates,
    isLoading: isLoadingTemplates,
    isFetching: isFetchingTemplates,
    isError: isTemplatesError,
    refetch: refetchTemplates,
  } = useWorkoutTemplates();

  const {
    exercises,
    isLoading: isLoadingExercises,
    isFetching: isFetchingExercises,
    isError: isExercisesError,
    refetch: refetchExercises,
  } = useExercises();
  const createExerciseMutation = useCreateExercise();

  /* =========================
     UI STATE
  ========================= */

  const [query, setQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState(ALL_MUSCLE_OPTION);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseMuscle, setNewExerciseMuscle] = useState<string>(
    CANONICAL_MUSCLE_GROUP_VALUES[0]
  );
  const [newExerciseEquipment, setNewExerciseEquipment] = useState("");
  const [newExerciseDescription, setNewExerciseDescription] = useState("");
  const [newExerciseDifficulty, setNewExerciseDifficulty] = useState("");

  /* =========================
     DERIVED DATA
  ========================= */

  const muscleOptions = useMemo(() => {
    const options = new Set<string>([ALL_MUSCLE_OPTION]);

    exercises.forEach((ex) => {
      if (ex.muscleGroup) {
        options.add(ex.muscleGroup);
      }
    });

    return Array.from(options);
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    const lowerQuery = query.toLowerCase();

    return exercises.filter((ex) => {
      const name = (ex.name ?? "").toLowerCase();

      const matchQuery = !query || name.includes(lowerQuery);
      const matchMuscle =
        selectedMuscle === ALL_MUSCLE_OPTION || ex.muscleGroup === selectedMuscle;

      return matchQuery && matchMuscle;
    });
  }, [exercises, query, selectedMuscle]);

  const existingExerciseNames = useMemo(
    () =>
      new Set(
        exercises
          .map((exercise) => exercise.name?.trim().toLocaleLowerCase("he"))
          .filter(Boolean)
      ),
    [exercises]
  );

  const newExerciseNameTrimmed = newExerciseName.trim();
  const nameAlreadyExists =
    Boolean(newExerciseNameTrimmed) &&
    existingExerciseNames.has(newExerciseNameTrimmed.toLocaleLowerCase("he"));

  const openCreateModal = (prefillName = "") => {
    const suggestedMuscle =
      selectedMuscle !== ALL_MUSCLE_OPTION
        ? selectedMuscle
        : CANONICAL_MUSCLE_GROUP_VALUES[0];

    setNewExerciseName(prefillName.trim());
    setNewExerciseMuscle(suggestedMuscle);
    setNewExerciseEquipment("");
    setNewExerciseDescription("");
    setNewExerciseDifficulty("");
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
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

    if (nameAlreadyExists) {
      Alert.alert("שגיאה", "תרגיל בשם הזה כבר קיים בספרייה.");
      return;
    }

    const payload: ExerciseCreateRequestDto = {
      name: newExerciseNameTrimmed,
      muscleGroup: newExerciseMuscle as ExerciseCreateRequestDto["muscleGroup"],
      equipment: newExerciseEquipment.trim() || undefined,
      description: newExerciseDescription.trim() || undefined,
      difficulty: newExerciseDifficulty.trim() || undefined,
    };

    try {
      await createExerciseMutation.mutateAsync(payload);
      closeCreateModal();
      setQuery("");
      setSelectedMuscle(newExerciseMuscle);
      Alert.alert("נוסף בהצלחה", "התרגיל נוסף לספריית התרגילים.");
    } catch (error) {
      Alert.alert("שגיאה", toErrorMessage(error));
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#f3f4f6" }}
        contentContainerStyle={{ padding: 20 }}
      >
        <WorkoutTemplatesList
          templates={templates}
          isLoading={isLoadingTemplates || isFetchingTemplates}
          isError={isTemplatesError}
          onRetry={refetchTemplates}
          onCreateNew={() => {
            console.log("create new template");
          }}
        />

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        >
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                textAlign: "right",
                flex: 1,
              }}
            >
              ספריית תרגילים (Exercise Library)
            </Text>

            <Pressable
              onPress={() => openCreateModal(query)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 999,
                backgroundColor: "#2563eb",
              }}
            >
              <Text style={{ color: "white", fontWeight: "800", fontSize: 12 }}>
                + תרגיל חדש
              </Text>
            </Pressable>
          </View>

          <WorkoutSearchBar value={query} onChange={setQuery} />

          <Pressable
            onPress={() => openCreateModal(query)}
            style={{
              marginTop: 10,
              marginBottom: 6,
              borderWidth: 1,
              borderColor: "#2563eb",
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 12,
              backgroundColor: "#eff6ff",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#1d4ed8",
                fontWeight: "700",
              }}
            >
              {query.trim()
                ? `+ הוסף "${query.trim()}" כתרגיל חדש`
                : "+ הוסף תרגיל חדש לספרייה"}
            </Text>
          </Pressable>

          <WorkoutFilters
            selectedMuscle={selectedMuscle}
            muscleOptions={muscleOptions}
            onChangeMuscle={setSelectedMuscle}
            totalCount={filteredExercises.length}
          />

          {isLoadingExercises || isFetchingExercises ? (
            <LoadingGridPlaceholder />
          ) : isExercisesError ? (
            <ErrorState onRetry={refetchExercises} />
          ) : filteredExercises.length === 0 ? (
            <EmptyState onCreate={() => openCreateModal(query)} />
          ) : (
            <WorkoutExerciseGrid exercises={filteredExercises} />
          )}
        </View>
      </ScrollView>

      <Modal
        visible={createModalOpen}
        animationType="fade"
        transparent
        onRequestClose={closeCreateModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 560,
              alignSelf: "center",
              backgroundColor: "white",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              padding: 16,
              gap: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "800", fontSize: 18 }}>
                הוספת תרגיל חדש
              </Text>
              <Pressable onPress={closeCreateModal}>
                <Text style={{ color: "#475569", fontSize: 18, fontWeight: "700" }}>
                  ✕
                </Text>
              </Pressable>
            </View>

            <TextInput
              value={newExerciseName}
              onChangeText={setNewExerciseName}
              placeholder="שם התרגיל"
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                textAlign: "right",
              }}
            />

            <View style={{ gap: 8 }}>
              <Text style={{ textAlign: "right", color: "#334155", fontWeight: "700" }}>
                קבוצת שריר *
              </Text>
              <View
                style={{
                  flexDirection: "row-reverse",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {CANONICAL_MUSCLE_GROUP_VALUES.map((muscle) => {
                  const isActive = newExerciseMuscle === muscle;
                  return (
                    <Pressable
                      key={muscle}
                      onPress={() => setNewExerciseMuscle(muscle)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: isActive ? "#2563eb" : "#e2e8f0",
                        backgroundColor: isActive ? "#2563eb" : "white",
                      }}
                    >
                      <Text
                        style={{
                          color: isActive ? "white" : "#1e293b",
                          fontWeight: "700",
                        }}
                      >
                        {muscle}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <TextInput
              value={newExerciseEquipment}
              onChangeText={setNewExerciseEquipment}
              placeholder="ציוד (אופציונלי)"
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                textAlign: "right",
              }}
            />

            <TextInput
              value={newExerciseDifficulty}
              onChangeText={setNewExerciseDifficulty}
              placeholder="רמת קושי (אופציונלי)"
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                textAlign: "right",
              }}
            />

            <TextInput
              value={newExerciseDescription}
              onChangeText={setNewExerciseDescription}
              placeholder="תיאור קצר (אופציונלי)"
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                textAlign: "right",
                minHeight: 90,
                textAlignVertical: "top",
              }}
            />

            {nameAlreadyExists ? (
              <Text style={{ color: "#b91c1c", textAlign: "right", fontWeight: "600" }}>
                תרגיל בשם הזה כבר קיים בספרייה
              </Text>
            ) : null}

            <View
              style={{
                flexDirection: "row-reverse",
                gap: 10,
              }}
            >
              <Pressable
                onPress={closeCreateModal}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  backgroundColor: "white",
                }}
                disabled={createExerciseMutation.isPending}
              >
                <Text style={{ color: "#334155", fontWeight: "700" }}>ביטול</Text>
              </Pressable>

              <Pressable
                onPress={handleCreateExercise}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    createExerciseMutation.isPending || nameAlreadyExists
                      ? "#93c5fd"
                      : "#2563eb",
                }}
                disabled={createExerciseMutation.isPending || nameAlreadyExists}
              >
                {createExerciseMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white", fontWeight: "800" }}>שמור תרגיל</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
/* =========================
   STATES
========================= */

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

      {onRetry && (
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
          <Text style={{ color: "white", fontWeight: "700" }}>
            נסה שוב
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function EmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <View
      style={{
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        gap: 12,
      }}
    >
      <Text style={{ textAlign: "right", color: "#6b7280" }}>
        אין תרגילים תואמים לחיפוש או לסינון שבחרת.
      </Text>

      {onCreate ? (
        <Pressable
          onPress={onCreate}
          style={{
            alignSelf: "flex-end",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: "#2563eb",
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            + הוסף תרגיל חדש
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
