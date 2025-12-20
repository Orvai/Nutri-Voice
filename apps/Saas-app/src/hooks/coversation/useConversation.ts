import { useQuery } from "@tanstack/react-query";
import { getApiConversationsId } from "@common/api/sdk/nutri-api";
import { conversationKeys } from "@/queryKeys/conversationKeys";
import { mapConversationToUI } from "@/mappers/conversation/conversation.mapper";

export const useConversation = (conversationId: string) =>
  useQuery({
    queryKey: conversationKeys.conversation(conversationId),
    queryFn: ({ signal }) =>
      getApiConversationsId(conversationId, signal),
    enabled: !!conversationId,
    select: (res) => mapConversationToUI(res),
  });
