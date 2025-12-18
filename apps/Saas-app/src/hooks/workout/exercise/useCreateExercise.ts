import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApiExercises } from "@common/api/sdk/nutri-api";
import type { ExerciseCreateRequestDto } from "@common/api/sdk/schemas";
import { workoutKeys } from "@/queryKeys/workoutKeys";

export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExerciseCreateRequestDto) =>
      postApiExercises(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercises(),
      });
    },
  });
}
