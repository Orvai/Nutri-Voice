// src/hooks/workout/useUpdateWorkoutTemplate.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putApiWorkoutTemplatesId } from "@common/api/sdk/nutri-api";
import type { WorkoutTemplateUpdateRequestDto } from "@common/api/sdk/schemas";
import { workoutKeys } from "@/queryKeys/workoutKeys";

export function useUpdateWorkoutTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      payload,
    }: {
      templateId: string;
      payload: WorkoutTemplateUpdateRequestDto;
    }) => putApiWorkoutTemplatesId(templateId, payload),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.template(vars.templateId),
      });
    },
  });
}
