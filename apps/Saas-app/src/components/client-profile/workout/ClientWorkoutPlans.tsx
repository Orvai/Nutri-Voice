import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";

import WorkoutPlansList from "./WorkoutPlansList";

import { useClientWorkoutPrograms } from "@/hooks/workout/workoutProgram/useClientWorkoutPrograms";
import { useCreateWorkoutProgram } from "@/hooks/workout/workoutProgram/useClientCreateWorkoutProgram";
import { useUpdateWorkoutProgram } from "@/hooks/workout/workoutProgram/useClientUpdateWorkoutProgram";
import { useClientDeleteWorkoutProgram } from "@/hooks/workout/workoutProgram/useClientDeleteWorkoutProgram";
import { useWorkoutTemplates } from "@/hooks/workout/workoutTemplate/useWorkoutTemplates";
import { useExercises } from "@/hooks/workout/exercise/useExercises";

import type { UIExercise } from "@/types/ui/workout/exercise.ui";
import type { UIWorkoutTemplate } from "@/types/ui/workout/workoutTemplate.ui";

import { styles } from "../styles/ClientWorkoutPlans.styles";

type Props = {
  clientId: string;
};

export default function ClientWorkoutPlans({ clientId }: Props) {
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);

  /* =========================
     Queries
  ========================= */

  const {
    programs,
    isLoading: programsLoading,
    isError: programsError,
    refetch: refetchPrograms,
  } = useClientWorkoutPrograms(clientId);

  const {
    templates,
    isLoading: templatesLoading,
    isError: templatesError,
    refetch: refetchTemplates,
  } = useWorkoutTemplates();

  const {
    exercises: allExercises,
    isLoading: exercisesLoading,
    isError: exercisesError,
    refetch: refetchExercises,
  } = useExercises();

  /* =========================
     Mutations
  ========================= */

  const createProgramMutation = useCreateWorkoutProgram(clientId);
  const updateProgramMutation = useUpdateWorkoutProgram(clientId);
  const deleteProgramMutation = useClientDeleteWorkoutProgram(clientId);

  /* =========================
     Derived
  ========================= */

  const plans = programs ?? [];

  const activePlan = useMemo(
    () => plans.find((p) => p.id === activeProgramId) ?? null,
    [plans, activeProgramId]
  );

  /* =========================
     Effects
  ========================= */

  useEffect(() => {
    if (!plans.length) {
      setActiveProgramId(null);
      return;
    }
    setActiveProgramId((prev) => prev ?? plans[0].id);
  }, [plans]);

  /* =========================
     Handlers
  ========================= */

  const handleCreateFromTemplate = async (template: UIWorkoutTemplate) => {
    await createProgramMutation.mutateAsync({
      name: template.name ?? "תוכנית אימון",
      templateId: template.id,
    });
  };

  const handleAddExercise = async (
    programId: string,
    exercise: UIExercise,
    orderHint?: number,
    meta?: { sets: number; reps: string }
  ) => {
    const maxOrder = orderHint ?? 0;
    const order = maxOrder + 1;

    await updateProgramMutation.mutateAsync({
      programId,
      dto: {
        exercisesToAdd: [
          {
            exerciseId: exercise.id,
            sets: meta?.sets ?? 3,
            reps: meta?.reps ?? "10",
            order,
          },
        ],
      },
    });
  };

  const handleRemoveExercise = async (
    programId: string,
    workoutExerciseId: string
  ) => {
    await updateProgramMutation.mutateAsync({
      programId,
      dto: {
        exercisesToDelete: [{ id: workoutExerciseId }],
      },
    });
  };

  const handleDeleteProgram = async (programId: string) => {
    await deleteProgramMutation.mutateAsync(programId);
    setActiveProgramId((prev) => (prev === programId ? null : prev));
  };

  const handleUpdateProgramNotes = async (programId: string, notes: string) => {
    await updateProgramMutation.mutateAsync({
      programId,
      dto: {
        notes,
      } as any,
    });
  };

  /* =========================
     Loading / Error UI
  ========================= */

  const isLoading =
    programsLoading || templatesLoading || exercisesLoading;

  const hasError =
    programsError || templatesError || exercisesError;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          שגיאה בטעינת נתוני אימונים
        </Text>

        <Pressable
          onPress={() => {
            refetchPrograms();
            refetchTemplates();
            refetchExercises();
          }}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>נסה שוב</Text>
        </Pressable>
      </View>
    );
  }

  /* =========================
     Render
  ========================= */

  return (
    <WorkoutPlansList
      plans={plans}
      activeProgramId={activeProgramId}
      onSelectPlan={setActiveProgramId}
      templates={templates}
      templatesLoading={templatesLoading}
      templatesError={templatesError}
      onReloadTemplates={refetchTemplates}
      onCreateFromTemplate={handleCreateFromTemplate}
      allExercises={allExercises}
      onAddExercise={handleAddExercise}
      onRemoveExercise={handleRemoveExercise}
      onDeleteProgram={handleDeleteProgram}
      onUpdateProgramNotes={handleUpdateProgramNotes}
    />
  );
}
