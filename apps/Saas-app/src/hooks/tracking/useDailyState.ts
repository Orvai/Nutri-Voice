// src/hooks/tracking/useDailyState.ts
import { useQuery } from "@tanstack/react-query";
import { getApiTrackingDailyState, getApiTrackingDailyStateRange } from "@common/api/sdk/nutri-api";
import { trackingKeys } from "@/queryKeys/trackingKeys";
import { mapDailyState } from "@/mappers/tracking/daily-state.mapper";
import { mapDailyStateList } from "@/mappers/tracking/daily-state-list.mapper";
import { DailyState } from "@/types/ui/tracking/daily-state.ui";

/* =========================================
   Queries
========================================= */
export function useDailyState(clientId?: string) {
  return useQuery<DailyState>({
    queryKey: clientId ? [...trackingKeys.dailyState(), clientId] : trackingKeys.dailyState(),
    queryFn: async ({ signal }) => {
      const res = await getApiTrackingDailyState({clientId}, signal); 
      return mapDailyState(res);
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

export function useDailyStateRange(startDate: string, endDate: string) {
  return useQuery<DailyState[]>({
    queryKey: trackingKeys.rangeState(startDate, endDate),
    queryFn: async ({ signal }) => {
      const res = await getApiTrackingDailyStateRange(
        { startDate, endDate }, 
        signal
      );
      
      return mapDailyStateList(res);
    },
    enabled: !!startDate && !!endDate, 
  });
}