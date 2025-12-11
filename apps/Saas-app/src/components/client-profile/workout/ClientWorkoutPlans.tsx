import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import AddExerciseModal from "./AddExerciseModal";
import WorkoutCategory from "./WorkoutCategory";
import { useWorkoutTemplates } from "../../../hooks/workout/useWorkoutTemplates";
import { useExercises } from "../../../hooks/workout/useExercises";
import { useClientWorkoutPrograms } from "../../../hooks/workout/useClientWorkoutPrograms";
import { useAuth } from "../../../context/AuthContext";
import type {
  UIWorkoutExercise,
  UIWorkoutTemplate,
  UIWorkoutProgram,
} from "../../../types/ui/workout-ui";

/* מיפוי של קבוצות שרירים מאנגלית לעברית */
const MUSCLE_LABELS: Record<string, string> = {
  CHEST: "חזה",
  BACK: "גב",
  LEGS: "רגליים",
  SHOULDERS: "כתפיים",
  BICEPS: "יד קדמית",
  TRICEPS: "יד אחורית",
  GLUTES: "ישבן",
  ABS: "בטן",
  Other: "אחר",
};

/* סדר קבוע לתצוגת קטגוריות */
const MUSCLE_ORDER: string[] = [
  "CHEST",
  "BACK",
  "LEGS",
  "SHOULDERS",
  "BICEPS",
  "TRICEPS",
  "GLUTES",
  "ABS",
  "Other",
];

/* פונקציה מקומית כפי שהייתה קיימת */
function groupExercises(
  program: UIWorkoutProgram,
  templateFallback: Record<string, string[]>
) {
  const map = new Map<string, UIWorkoutExercise[]>();
  for (const ex of program.exercises ?? []) {
    const muscle = ex.exercise.muscleGroup ?? "Other";
    map.set(muscle, [...(map.get(muscle) ?? []), ex]);
  }
  if (map.size === 0) {
    const muscles =
      templateFallback[program.id] ?? program.templateMuscleGroups ?? [];
    return muscles.map((muscle) => ({
      muscle,
      exercises: [],
    }));
  }
  return Array.from(map.entries()).map(([muscle, exercises]) => ({
    muscle,
    exercises,
  }));
}

export default function ClientWorkoutPlans({ clientId }: { clientId: string }) {
  const { user } = useAuth();
  const coachId = user?.id ?? "coach-placeholder";

  const {
    programs,
    isLoading: programsLoading,
    isFetching: programsFetching,
    createProgram,
    updateProgram,
    deleteProgram,
  } = useClientWorkoutPrograms(clientId);

  const {
    templates,
    isLoading: templatesLoading,
    isError: templatesError,
    refetch: refetchTemplates,
  } = useWorkoutTemplates();

  const { data: exercises = [] } = useExercises();

  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [templateMuscleGroups, setTemplateMuscleGroups] = useState<
    Record<string, string[]>
  >({});

  /* עדכון הפעיל ברגע שיש רשימת תוכניות */
  useEffect(() => {
    if (programs.length && !activeProgramId) {
      setActiveProgramId(programs[0].id);
    }
    if (
      activeProgramId &&
      programs.length &&
      !programs.find((p) => p.id === activeProgramId)
    ) {
      setActiveProgramId(programs[0].id);
    }
    if (!programs.length) {
      setActiveProgramId(null);
    }
  }, [activeProgramId, programs]);

  const activeProgram = useMemo(() => {
    if (!programs.length) return null;
    return programs.find((p) => p.id === activeProgramId) ?? programs[0];
  }, [activeProgramId, programs]);

  /* קיבוץ התרגילים לפי קבוצת שרירים */
  const categories = useMemo(() => {
    if (!activeProgram) return [];
    return groupExercises(activeProgram, templateMuscleGroups);
  }, [activeProgram, templateMuscleGroups]);

  /* מיון ותרגום שם הקטגוריה לעברית */
  const translatedCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        displayName: MUSCLE_LABELS[cat.muscle] ?? cat.muscle,
      }))
      .sort((a, b) => {
        const ai = MUSCLE_ORDER.indexOf(a.muscle);
        const bi = MUSCLE_ORDER.indexOf(b.muscle);
        return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
      });
  }, [categories]);

  /* הוספת תרגיל לתוכנית */
  const handleAddExercise = async (exercise) => {
    if (!activeProgram) return;
    const maxOrder = activeProgram.exercises.reduce(
      (acc, ex) => Math.max(acc, ex.order ?? 0),
      0
    );
    await updateProgram.mutateAsync({
      programId: activeProgram.id,
      payload: {
        exercisesToAdd: [
          {
            exerciseId: exercise.id,
            sets: 4,
            reps: "10-12",
            weight: null,
            rest: null,
            order: maxOrder + 1,
          },
        ],
      },
    });
  };

  /* עוטף את פעולת ההוספה וסוגר את המודאל בסיום */
  const handleSelectExercise = async (exercise) => {
    await handleAddExercise(exercise);
    setExerciseModalOpen(false);
    setSelectedMuscle(null);
  };

  /* מחיקת תרגיל מהתוכנית */
  const handleRemoveExercise = async (exerciseId: string) => {
    if (!activeProgram) return;
    await updateProgram.mutateAsync({
      programId: activeProgram.id,
      payload: {
        exercisesToDelete: [{ id: exerciseId }],
      },
    });
  };

  /* יצירת תוכנית חדשה מתבנית */
  const handleCreateProgramFromTemplate = async (
    template: UIWorkoutTemplate
  ) => {
    const created = await createProgram.mutateAsync({
      name: template.workoutType,
      clientId,
      coachId,
      templateId: template.id,
    });
    if (created) {
      setTemplateMuscleGroups((prev) => ({
        ...prev,
        [created.id]: template.muscleGroups ?? [],
      }));
      setActiveProgramId(created.id);
    }
  };

  /* רינדור כפתורי הטאב של התוכניות */
  const renderProgramsTabs = () => {
    if (programsLoading || programsFetching) {
      return (
        <View style={{ paddingVertical: 12 }}>
          <ActivityIndicator />
        </View>
      );
    }
    if (!programs.length) return null;
    return (
      <View
        style={{
          flexDirection: "row-reverse",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {programs.map((program) => {
          const active = program.id === activeProgram?.id;
          return (
            <Pressable
              key={program.id}
              onPress={() => setActiveProgramId(program.id)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 999,
                backgroundColor: active ? "#2563eb" : "#e5e7eb",
              }}
            >
              <Text
                style={{
                  color: active ? "#fff" : "#111827",
                  fontWeight: "700",
                }}
              >
                {program.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  /* רינדור מצב ריק */
  const renderEmptyState = () => (
    <View
      style={{
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        backgroundColor: "#f9fafb",
        marginTop: 16,
      }}
    >
      <Text style={{ textAlign: "right", color: "#6b7280" }}>
        אין עדיין תוכניות אימון ללקוח.
      </Text>
    </View>
  );

  /* רינדור הקטגוריות */
  const renderCategories = () => {
    if (!activeProgram) return renderEmptyState();
    if (!translatedCategories.length && programsLoading) {
      return (
        <View style={{ paddingVertical: 24 }}>
          <ActivityIndicator />
        </View>
      );
    }
    if (!translatedCategories.length) {
      return renderEmptyState();
    }
    return translatedCategories.map((group) => (
      <WorkoutCategory
        key={group.muscle}
        group={group.displayName}
        exercises={group.exercises.map((ex) => ({
          id: ex.id,
          name: ex.exercise.name,
          muscleGroup: ex.exercise.muscleGroup,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
        }))}
        onAdd={() => {
          setSelectedMuscle(group.muscle);
          setExerciseModalOpen(true);
        }}
        onRemove={handleRemoveExercise}
      />
    ));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700" }}>
          תוכניות אימון של הלקוח
        </Text>
        <Pressable
          onPress={() => setTemplateModalOpen(true)}
          style={{
            backgroundColor: "#2563eb",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>+ צור תוכנית חדשה</Text>
        </Pressable>
      </View>

      {renderProgramsTabs()}

      <ScrollView style={{ flex: 1 }}>
        {renderCategories()}
        {activeProgram ? (
          <Pressable
            onPress={() => deleteProgram.mutate(activeProgram.id)}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: "#dc2626", textAlign: "right" }}>
              מחק תוכנית
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>

      {/* מודאל להוספת תרגיל */}
      <AddExerciseModal
        visible={exerciseModalOpen}
        onClose={() => setExerciseModalOpen(false)}
        exercises={exercises}
        muscleGroup={selectedMuscle}
        onSelect={handleSelectExercise}
      />

      {/* מודאל בחירת תבנית */}
      <Modal visible={templateModalOpen} animationType="slide">
        <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
          <Pressable onPress={() => setTemplateModalOpen(false)}>
            <Text style={{ textAlign: "right", color: "#2563eb" }}>✕ סגור</Text>
          </Pressable>

          {templatesError ? (
            <View style={{ paddingVertical: 20 }}>
              <Text style={{ textAlign: "right", color: "#dc2626" }}>
                לא הצלחנו לטעון תבניות.
              </Text>
              <Pressable
                onPress={() => refetchTemplates()}
                style={{ marginTop: 8 }}
              >
                <Text style={{ color: "#2563eb", textAlign: "right" }}>
                  נסה שוב
                </Text>
              </Pressable>
            </View>
          ) : null}

          {templatesLoading ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator />
            </View>
          ) : (
            templates.map((template) => (
              <Pressable
                key={template.id}
                onPress={async () => {
                  await handleCreateProgramFromTemplate(template);
                  setTemplateModalOpen(false);
                }}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                  backgroundColor: "#e0f2fe",
                  borderColor: "#bae6fd",
                  borderWidth: 1,
                }}
              >
                <Text style={{ textAlign: "right", color: "#0284c7" }}>
                  {template.workoutType}
                </Text>
              </Pressable>
            ))
          )}

          {!templatesLoading && templates.length === 0 && !templatesError ? (
            <View style={{ paddingVertical: 20 }}>
              <Text style={{ textAlign: "right", color: "#6b7280" }}>
                אין תבניות זמינות.
              </Text>
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}
