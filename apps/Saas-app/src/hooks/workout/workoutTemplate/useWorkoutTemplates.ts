// src/hooks/workout/useWorkoutTemplates.ts
import { useQuery } from "@tanstack/react-query";
import { getApiWorkoutTemplates  } from "@common/api/sdk/nutri-api";
import type { WorkoutTemplateResponseDto } from "@common/api/sdk/schemas";

import { workoutKeys } from "@/queryKeys/workoutKeys";
import { mapWorkoutTemplateToUI } from "@/mappers/workout/mapWorkoutTemplateToUI";
import type { UIWorkoutTemplate } from "@/types/ui/workout/workoutTemplate.ui";

export function useWorkoutTemplates() {
  const query = useQuery<
    WorkoutTemplateResponseDto[],
    unknown,
    UIWorkoutTemplate[]
  >({
    queryKey: workoutKeys.templates(),
    queryFn: ({ signal }) => getApiWorkoutTemplates ( signal ),
    select: (data) => data.map(mapWorkoutTemplateToUI),
  });

  return {
    templates: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
