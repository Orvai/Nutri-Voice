import { useQuery } from "@tanstack/react-query";
import { getAssistantState } from "@/data/mocks/repositories/assistantMockRepository";
import { mapAssistantStateToUI } from "@/mappers/assistant/assistant.mapper";
import { assistantKeys } from "@/queryKeys/assistantKeys";

export function useAssistantState() {
  const query = useQuery({
    queryKey: assistantKeys.state(),
    queryFn: getAssistantState,
    select: mapAssistantStateToUI
  });

  return {
    state: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch
  };
}
