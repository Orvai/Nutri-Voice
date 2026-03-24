import { useQuery } from "@tanstack/react-query";
import { getApiConversationsId } from "@common/api/sdk/nutri-api";
import { conversationKeys } from "@/queryKeys/conversationKeys";
import { mapConversationToUI } from "@/mappers/conversation/conversation.mapper";
import { REALTIME_INTERVAL_MS } from "@/hooks/realtime/realtime.constants";

export const useConversation = (conversationId: string) =>
  useQuery({
    queryKey: conversationKeys.conversation(conversationId),
    queryFn: ({ signal }) =>
      getApiConversationsId(conversationId, signal),
    enabled: !!conversationId,
    refetchInterval: conversationId ? REALTIME_INTERVAL_MS.conversations : false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
    select: (res) => mapConversationToUI(res),
  });
