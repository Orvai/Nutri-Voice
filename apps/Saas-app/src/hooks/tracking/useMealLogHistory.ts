import { useQuery } from "@tanstack/react-query";
import { getApiTrackingMealLogHistoryClientId } from "@common/api/sdk/nutri-api";
import { trackingKeys } from "./trackingKeys";

export const useMealLogHistory = (clientId: string) => {
  return useQuery({
    queryKey: trackingKeys.mealLogHistory(clientId),
    queryFn: ({ signal }) =>
      getApiTrackingMealLogHistoryClientId(clientId, signal),
    enabled: !!clientId,
  });
};
