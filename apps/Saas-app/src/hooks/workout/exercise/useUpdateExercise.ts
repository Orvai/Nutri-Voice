import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putApiExercisesId } from "@common/api/sdk/nutri-api";
import type { ExerciseUpdateRequestDto } from "@common/api/sdk/schemas";
import { workoutKeys } from "@/queryKeys/workoutKeys";

export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ExerciseUpdateRequestDto;
    }) => putApiExercisesId(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercises(),
      });
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercise(variables.id),
      });
    },
  });
}
