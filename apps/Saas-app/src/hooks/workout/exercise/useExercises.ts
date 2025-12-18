import { useQuery } from "@tanstack/react-query";
import { workoutKeys } from "@/queryKeys/workoutKeys";

import { getApiWorkoutExercises } from "@common/api/sdk/nutri-api";
import type { ExerciseResponseDto } from "@common/api/sdk/schemas";

import { mapExerciseDtoToUI } from "@/mappers/workout/exercise.mapper";
import type { UIExercise } from "@/types/ui/workout/exercise.ui";

export function useExercises() {
  const query = useQuery<
    ExerciseResponseDto[],
    unknown,
    UIExercise[]
  >({
    queryKey: workoutKeys.exercises(),
    queryFn: ({ signal }) => getApiWorkoutExercises(signal),
    select: (data) => data.map(mapExerciseDtoToUI),
  });

  return {
    exercises: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
