import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWorkoutTemplate,
  deleteWorkoutTemplate,
  fetchWorkoutTemplates,
  updateWorkoutTemplate,
} from "../../api/workout-api/workoutTemplate.api";
import { mapWorkoutTemplateToUI, type UIWorkoutTemplate } from "../../types/ui/workout-ui";

type UseWorkoutTemplatesResult = {
  templates: UIWorkoutTemplate[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
  isFetching: boolean;
  createTemplate: ReturnType<typeof useMutation>;
  updateTemplate: ReturnType<typeof useMutation>;
  deleteTemplate: ReturnType<typeof useMutation>;
};

export function useWorkoutTemplates(): UseWorkoutTemplatesResult {
  const queryClient = useQueryClient();

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

  const createTemplate = useMutation({
    mutationFn: createWorkoutTemplate,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["workoutTemplates"] }),
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) =>
      updateWorkoutTemplate(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["workoutTemplates"] }),
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: deleteWorkoutTemplate,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["workoutTemplates"] }),
  });

  return {
    templates: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: () => query.refetch(),
    createTemplate,
    updateTemplate: updateTemplateMutation,
    deleteTemplate: deleteTemplateMutation,
  };
}