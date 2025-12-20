import { useQuery } from "@tanstack/react-query";
import { getApiConversationsIdMessages } from "@common/api/sdk/nutri-api";
import { conversationKeys } from "@/queryKeys/conversationKeys";
import { mapMessageToUI } from "@/mappers/conversation/message.mapper";

export const useConversationMessages = (conversationId: string) =>
  useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: ({ signal }) =>
      getApiConversationsIdMessages(conversationId, signal),
    enabled: !!conversationId,
    select: (res) => res.map(mapMessageToUI),
  });
