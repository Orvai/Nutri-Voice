import { useQuery } from "@tanstack/react-query";
import { fetchWorkoutTemplates } from "../../api/workout-api/workoutTemplate.api";
import { mapWorkoutTemplateToUI, type UIWorkoutTemplate } from "../../types/ui/workout-ui";

type UseWorkoutTemplatesResult = {
  templates: UIWorkoutTemplate[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
  isFetching: boolean;
};

export function useWorkoutTemplates(): UseWorkoutTemplatesResult {
  const query = useQuery<UIWorkoutTemplate[]>({
    queryKey: ["workoutTemplates"],
    queryFn: async () => {
      const templates = await fetchWorkoutTemplates();
      const parsedTemplates = Array.isArray((templates as any)?.data)
        ? (templates as any).data
        : templates ?? [];

      return parsedTemplates
        .filter(Boolean)
        .map(mapWorkoutTemplateToUI);
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