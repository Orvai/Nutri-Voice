import { useQuery } from "@tanstack/react-query";
import { fetchWorkoutTemplates } from "../../api/workout-api/workoutTemplate.api";
import type { UIWorkoutProgram } from "../../types/ui/workout-ui";
import { mapWorkoutTemplateToUI } from "../../types/ui/workout-ui";

type UseWorkoutTemplatesResult = {
  templates: UIWorkoutProgram[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
  isFetching: boolean;
};

export function useWorkoutTemplates(): UseWorkoutTemplatesResult {
  const query = useQuery({
    queryKey: ["workoutTemplates"],
    queryFn: async () => {
      const templates = await fetchWorkoutTemplates();
      return templates.map(mapWorkoutTemplateToUI);
    },
  });

  return {
    templates: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: () => query.refetch(),
  };
}