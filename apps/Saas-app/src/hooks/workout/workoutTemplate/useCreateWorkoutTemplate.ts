// src/hooks/workout/useCreateWorkoutTemplate.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApiWorkoutTemplates } from "@common/api/sdk/nutri-api";
import type { WorkoutTemplateCreateRequestDto } from "@common/api/sdk/schemas";
import { workoutKeys } from "@/queryKeys/workoutKeys";

export function useCreateWorkoutTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkoutTemplateCreateRequestDto) =>
        postApiWorkoutTemplates(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.templates(),
      });
    },
  });
}
