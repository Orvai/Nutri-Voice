import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApiExercisesId } from "@common/api/sdk/nutri-api";
import { workoutKeys } from "@/queryKeys/workoutKeys";

export function useDeleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApiExercisesId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercises(),
      });
    },
  });
}
