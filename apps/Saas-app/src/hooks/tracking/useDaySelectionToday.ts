import { useQuery } from "@tanstack/react-query";
import { getApiTrackingDaySelectionTodayClientId } from "@common/api/sdk/nutri-api";
import { trackingKeys } from "./trackingKeys";

export const useDaySelectionToday = (clientId: string) => {
  return useQuery({
    queryKey: trackingKeys.daySelectionToday(clientId),
    queryFn: ({ signal }) =>
      getApiTrackingDaySelectionTodayClientId(clientId, signal),
    enabled: !!clientId,
  });
};
