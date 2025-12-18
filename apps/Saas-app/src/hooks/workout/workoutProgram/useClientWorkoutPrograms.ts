import { useQuery } from "@tanstack/react-query";
import { workoutKeys } from "@/queryKeys/workoutKeys";
import {
  getApiWorkoutClientIdWorkoutPrograms,
  getApiWorkoutClientIdWorkoutProgramsProgramId,
} from "@common/api/sdk/nutri-api";
import { mapWorkoutProgramToUI } from "@/mappers/workout/workoutProgram.mapper";


export function useClientWorkoutPrograms(clientId?: string) {
  const query = useQuery({
    queryKey: clientId ? workoutKeys.clientPrograms(clientId) : [],
    enabled: !!clientId,
    queryFn: ({ signal }) => getApiWorkoutClientIdWorkoutPrograms(clientId!, signal),
    select: (data) => (data ?? []).map(mapWorkoutProgramToUI),
  });

  return {
    programs: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}


export function useClientWorkoutProgram(clientId?: string, programId?: string) {
  const query = useQuery({
    queryKey: clientId && programId ? workoutKeys.clientProgram(clientId, programId) : [],
    enabled: !!clientId && !!programId,
    queryFn: ({ signal }) =>
      getApiWorkoutClientIdWorkoutProgramsProgramId(clientId!, programId!, signal),
    select: mapWorkoutProgramToUI,
  });

  return {
    program: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
