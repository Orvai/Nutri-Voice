import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApiExercisesIdVideo } from "@common/api/sdk/nutri-api";
import type { PostApiExercisesIdVideoBody } from "@common/api/sdk/schemas";
import { workoutKeys } from "@/queryKeys/workoutKeys";

export function useUploadExerciseVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      file,
    }: {
      id: string;
      file: File;
    }) =>
      postApiExercisesIdVideo(id, { file }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercise(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercises(),
      });
    },
  });
}
