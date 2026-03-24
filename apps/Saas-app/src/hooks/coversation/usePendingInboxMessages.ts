import { useQuery } from "@tanstack/react-query";
import { getApiInboxPending } from "@common/api/sdk/nutri-api";
import { conversationKeys } from "@/queryKeys/conversationKeys";
import { mapMessageToUI } from "@/mappers/conversation/message.mapper";
import { REALTIME_INTERVAL_MS } from "@/hooks/realtime/realtime.constants";

export const usePendingInboxMessages = () =>
  useQuery({
    queryKey: conversationKeys.inbox(),
    queryFn: ({ signal }) => getApiInboxPending(signal),
    refetchInterval: REALTIME_INTERVAL_MS.inbox,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
    select: (res) => res.data.map(mapMessageToUI),
  });
