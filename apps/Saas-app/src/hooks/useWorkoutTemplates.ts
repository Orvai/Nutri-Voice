import { useWorkoutPrograms } from "./workout/useWorkoutPrograms";
import type { UIWorkoutProgram } from "../types/ui/workout-ui";

type UseWorkoutTemplatesResult = {
  templates: UIWorkoutProgram[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
  isFetching: boolean;
};

export function useWorkoutTemplates(): UseWorkoutTemplatesResult {
  const query = useWorkoutPrograms();

  return {
    templates: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: () => query.refetch(),
  };
}