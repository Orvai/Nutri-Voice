import { useQuery } from "@tanstack/react-query";
import { workoutKeys } from "@/queryKeys/workoutKeys";
import {
  getApiWorkoutProgramsProgramId,
} from "@common/api/sdk/nutri-api";
import { mapWorkoutProgramToUI } from "@/mappers/workout/workoutProgram.mapper";

export function useWorkoutProgram(programId?: string) {
  const query = useQuery({
    queryKey: programId
      ? workoutKeys.program(programId)
      : [],
    enabled: !!programId,
    queryFn: ({ signal }) =>
      getApiWorkoutProgramsProgramId(programId!, signal),
    select: mapWorkoutProgramToUI,
  });

  return {
    program: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
