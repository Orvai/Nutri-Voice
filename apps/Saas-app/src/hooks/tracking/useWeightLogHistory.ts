import { useQuery } from "@tanstack/react-query";
import { getApiTrackingWeightLogHistoryClientId } from "@common/api/sdk/nutri-api";
import { trackingKeys } from "./trackingKeys";

export const useWeightLogHistory = (clientId: string) => {
  return useQuery({
    queryKey: trackingKeys.weightLogHistory(clientId),
    queryFn: ({ signal }) =>
      getApiTrackingWeightLogHistoryClientId(clientId, signal),
    enabled: !!clientId,
  });
};
