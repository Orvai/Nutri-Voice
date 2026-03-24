import { useQuery } from "@tanstack/react-query";
import { getCommunityState } from "@/data/mocks/repositories/communityMockRepository";
import { mapCommunityStateToUI } from "@/mappers/community/community.mapper";
import { communityKeys } from "@/queryKeys/communityKeys";

export function useCommunityFeed() {
  const query = useQuery({
    queryKey: communityKeys.root(),
    queryFn: getCommunityState,
    select: mapCommunityStateToUI
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch
  };
}
