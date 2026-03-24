import { useQuery } from "@tanstack/react-query";
import {
  getWorkoutProgramById,
  getWorkoutPrograms
} from "@/data/mocks/repositories/workoutMockRepository";
import {
  mapWorkoutDetailsToUI,
  mapWorkoutProgramToUI
} from "@/mappers/workout/workout.mapper";
import { workoutKeys } from "@/queryKeys/workoutKeys";

export function useWorkoutPrograms() {
  const query = useQuery({
    queryKey: workoutKeys.programs(),
    queryFn: getWorkoutPrograms,
    select: (items) => items.map(mapWorkoutProgramToUI)
  });

  return {
    programs: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch
  };
}

export function useWorkoutPreview(programId: string) {
  const query = useQuery({
    queryKey: workoutKeys.program(programId),
    queryFn: () => getWorkoutProgramById(programId),
    select: (program) => (program ? mapWorkoutDetailsToUI(program) : null)
  });

  return {
    workout: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch
  };
}
