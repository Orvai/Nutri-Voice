import { useQuery } from "@tanstack/react-query";
import { getApiTrackingWorkoutLogHistoryClientId } from "@common/api/sdk/nutri-api";
import { trackingKeys } from "./trackingKeys";

export const useWorkoutLogHistory = (clientId: string) => {
  return useQuery({
    queryKey: trackingKeys.workoutLogHistory(clientId),
    queryFn: ({ signal }) =>
      getApiTrackingWorkoutLogHistoryClientId(clientId, signal),
    enabled: !!clientId,
  });
};
