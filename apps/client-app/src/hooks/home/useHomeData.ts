import { useQuery } from "@tanstack/react-query";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { getHomeSnapshot } from "@/data/mocks/repositories/homeMockRepository";
import { mapHomeSnapshotToUI } from "@/mappers/home/home.mapper";
import { homeKeys } from "@/queryKeys/homeKeys";

export function useHomeData() {
  const { user, isHydrated } = useAuthSession();

  const query = useQuery({
    queryKey: homeKeys.today(user?.id ?? "guest"),
    enabled: isHydrated && !!user?.id,
    queryFn: getHomeSnapshot,
    select: mapHomeSnapshotToUI
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
