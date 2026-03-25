import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetcher } from "@common/api/sdk/fetcher";
import { workoutKeys } from "@/queryKeys/workoutKeys";

type UploadableVideoFile =
  | File
  | {
      uri: string;
      name: string;
      type: string;
    };

const uploadWorkoutExerciseVideo = (
  id: string,
  file: UploadableVideoFile,
  signal?: AbortSignal
) => {
  const formData = new FormData();
  formData.append("file", file as any);

  return customFetcher<void>({
    url: `/api/workout/exercises/${id}/video`,
    method: "POST",
    data: formData,
    signal,
  });
};

export function useUploadExerciseVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      file,
    }: {
      id: string;
      file: UploadableVideoFile;
    }) =>
      uploadWorkoutExerciseVideo(id, file),

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
