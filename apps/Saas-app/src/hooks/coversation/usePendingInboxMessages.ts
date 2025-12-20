import { useQuery } from "@tanstack/react-query";
import { getApiInboxPending } from "@common/api/sdk/nutri-api";
import { conversationKeys } from "@/queryKeys/conversationKeys";
import { mapMessageToUI } from "@/mappers/conversation/message.mapper";

export const usePendingInboxMessages = () =>
  useQuery({
    queryKey: conversationKeys.inbox(),
    queryFn: ({ signal }) => getApiInboxPending(signal),
    select: (res) => res.data.map(mapMessageToUI),
  });
