import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetcher } from "@common/api/sdk/fetcher";
import { workoutKeys } from "@/queryKeys/workoutKeys";

const deleteWorkoutExerciseVideo = (id: string) =>
  customFetcher<void>({
    url: `/api/workout/exercises/${id}/video`,
    method: "DELETE",
  });

export function useDeleteExerciseVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWorkoutExerciseVideo(id),
    onSuccess: (_, exerciseId) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercise(exerciseId),
      });
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercises(),
      });
    },
  });
}
