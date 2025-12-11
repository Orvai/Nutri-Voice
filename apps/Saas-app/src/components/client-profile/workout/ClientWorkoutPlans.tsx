// apps/Saas-app/src/components/client-profile/workout/ClientWorkoutPlans.tsx

import { useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { useClientWorkoutPrograms } from "../../../hooks/workout/useClientWorkoutPrograms";
import { useWorkoutTemplates } from "../../../hooks/workout/useWorkoutTemplates";
import { useExercises } from "../../../hooks/workout/useExercises";
import type {
  UIWorkoutProgram,
  UIWorkoutTemplate,
  UIExercise,
} from "../../../types/ui/workout-ui";
import WorkoutPlansList from "./WorkoutPlansList";

type Props = {
  clientId: string;
};

export default function ClientWorkoutPlans({ clientId }: Props) {
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

  const {
    data: exercises = [],
    isLoading: exercisesLoading,
  } = useExercises();

  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);

  // ניהול התוכנית האקטיבית
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

  const activeProgram = useMemo<UIWorkoutProgram | null>(() => {
    if (!programs.length) return null;
    return programs.find((p) => p.id === activeProgramId) ?? programs[0];
  }, [activeProgramId, programs]);

  const isLoadingAll =
    programsLoading || programsFetching || templatesLoading || exercisesLoading;

  // יצירת תוכנית חדשה מתבנית
  const handleCreateFromTemplate = async (template: UIWorkoutTemplate) => {
    const created = await createProgram.mutateAsync({
      name: template.name ?? template.workoutType,
      clientId,
      coachId,
      templateId: template.id,
    });

    if (created) {
      setActiveProgramId(created.id);
    }
  };

  // הוספת תרגיל לתוכנית
  const handleAddExercise = async (
    programId: string,
    exercise: UIExercise,
    orderHint?: number
  ) => {
    const program = programs.find((p) => p.id === programId);
    if (!program) return;

    const maxOrder = (program.exercises ?? []).reduce(
      (acc, ex) => Math.max(acc, ex.order ?? 0),
      orderHint ?? 0
    );

    await updateProgram.mutateAsync({
      programId,
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

  // מחיקת תרגיל
  const handleRemoveExercise = async (
    programId: string,
    workoutExerciseId: string
  ) => {
    await updateProgram.mutateAsync({
      programId,
      payload: {
        exercisesToDelete: [{ id: workoutExerciseId }],
      },
    });
  };

  // מחיקת תוכנית
  const handleDeleteProgram = async (programId: string) => {
    await deleteProgram.mutateAsync(programId);
  };

  if (isLoadingAll && !programs.length) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!programs.length && templatesError) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ textAlign: "right", color: "#dc2626" }}>
          לא הצלחנו לטעון תוכניות או תבניות.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <WorkoutPlansList
        plans={programs}
        activeProgramId={activeProgram?.id ?? null}
        onSelectPlan={setActiveProgramId}
        templates={templates}
        templatesLoading={templatesLoading}
        templatesError={templatesError}
        onReloadTemplates={refetchTemplates}
        onCreateFromTemplate={handleCreateFromTemplate}
        allExercises={exercises}
        onAddExercise={handleAddExercise}
        onRemoveExercise={handleRemoveExercise}
        onDeleteProgram={handleDeleteProgram}
      />
    </View>
  );
}
