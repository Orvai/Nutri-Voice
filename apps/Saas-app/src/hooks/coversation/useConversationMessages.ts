import { useQuery } from "@tanstack/react-query";
import { getApiConversationsIdMessages } from "@common/api/sdk/nutri-api";
import { conversationKeys } from "@/queryKeys/conversationKeys";
import { mapMessageToUI } from "@/mappers/conversation/message.mapper";
import { REALTIME_INTERVAL_MS } from "@/hooks/realtime/realtime.constants";

export const useConversationMessages = (conversationId: string) =>
  useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: ({ signal }) =>
      getApiConversationsIdMessages(conversationId, signal),
    enabled: !!conversationId,
    refetchInterval: conversationId ? REALTIME_INTERVAL_MS.chatMessages : false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
    select: (res) => res.map(mapMessageToUI),
  });
