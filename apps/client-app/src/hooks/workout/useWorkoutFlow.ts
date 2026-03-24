import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  finishWorkout,
  getActiveWorkout,
  getRestSecondsRemaining,
  getWorkoutSummary,
  startWorkout,
  updateWorkoutSet
} from "@/data/mocks/repositories/workoutMockRepository";
import {
  mapActiveWorkoutToUI,
  mapWorkoutSummaryToUI
} from "@/mappers/workout/workout.mapper";
import { assistantKeys } from "@/queryKeys/assistantKeys";
import { homeKeys } from "@/queryKeys/homeKeys";
import { nutritionKeys } from "@/queryKeys/nutritionKeys";
import { workoutKeys } from "@/queryKeys/workoutKeys";

export function useActiveWorkout(programId: string) {
  const query = useQuery({
    queryKey: workoutKeys.active(programId),
    queryFn: () => getActiveWorkout(programId),
    refetchInterval: 1000,
    select: (session) => {
      if (!session) {
        return null;
      }

      return mapActiveWorkoutToUI(
        session,
        getRestSecondsRemaining(session.restEndsAtIso)
      );
    }
  });

  return {
    session: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch
  };
}

export function useWorkoutSummary(programId: string) {
  const query = useQuery({
    queryKey: workoutKeys.summary(programId),
    queryFn: () => getWorkoutSummary(programId),
    select: (summary) => (summary ? mapWorkoutSummaryToUI(summary) : null)
  });

  return {
    summary: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch
  };
}

export function useWorkoutMutations() {
  const queryClient = useQueryClient();

  const invalidate = async (programId?: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: workoutKeys.root() }),
      queryClient.invalidateQueries({ queryKey: homeKeys.root() }),
      queryClient.invalidateQueries({ queryKey: assistantKeys.root() }),
      queryClient.invalidateQueries({ queryKey: nutritionKeys.root() }),
      programId
        ? queryClient.invalidateQueries({ queryKey: workoutKeys.active(programId) })
        : Promise.resolve(),
      programId
        ? queryClient.invalidateQueries({ queryKey: workoutKeys.summary(programId) })
        : Promise.resolve()
    ]);
  };

  const startMutation = useMutation({
    mutationKey: workoutKeys.root(),
    mutationFn: startWorkout,
    onSuccess: (_, programId) => {
      void invalidate(programId);
    }
  });

  const setMutation = useMutation({
    mutationKey: workoutKeys.root(),
    mutationFn: updateWorkoutSet,
    onSuccess: (_, variables) => {
      void invalidate(variables.programId);
    }
  });

  const finishMutation = useMutation({
    mutationKey: workoutKeys.root(),
    mutationFn: finishWorkout,
    onSuccess: (_, programId) => {
      void invalidate(programId);
    }
  });

  return {
    startWorkout: startMutation.mutateAsync,
    updateSet: setMutation.mutateAsync,
    finishWorkout: finishMutation.mutateAsync,
    isStarting: startMutation.isPending,
    isUpdatingSet: setMutation.isPending,
    isFinishing: finishMutation.isPending,
    error:
      (startMutation.error as Error | null)?.message ??
      (setMutation.error as Error | null)?.message ??
      (finishMutation.error as Error | null)?.message ??
      null
  };
}
