import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetcher } from "@common/api/sdk/fetcher";
import type {
  ExerciseCreateRequestDto,
  ExerciseResponseDto,
} from "@common/api/sdk/schemas";
import { workoutKeys } from "@/queryKeys/workoutKeys";

const createWorkoutExercise = (
  data: ExerciseCreateRequestDto,
  signal?: AbortSignal
) =>
  customFetcher<ExerciseResponseDto>({
    url: "/api/workout/exercises",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data,
    signal,
  });

export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExerciseCreateRequestDto) =>
      createWorkoutExercise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercises(),
      });
    },
  });
}
