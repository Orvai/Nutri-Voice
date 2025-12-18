// src/hooks/workout/useDeleteWorkoutTemplate.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApiWorkoutTemplatesId } from "@common/api/sdk/nutri-api";
import { workoutKeys } from "@/queryKeys/workoutKeys";

export function useDeleteWorkoutTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) =>
        deleteApiWorkoutTemplatesId(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.templates(),
      });
    },
  });
}
