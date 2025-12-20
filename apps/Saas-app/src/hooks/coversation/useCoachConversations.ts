import { useQuery } from "@tanstack/react-query";
import { getApiConversations } from "@common/api/sdk/nutri-api";
import { conversationKeys } from "@/queryKeys/conversationKeys";
import { mapConversationToUI } from "@/mappers/conversation/conversation.mapper";

export const useCoachConversations = (coachId?: string) =>
  useQuery({
    queryKey: coachId
      ? conversationKeys.listByCoach(coachId)
      : conversationKeys.all,
    queryFn: ({ signal }) =>
      getApiConversations(signal),
    select: (res) => res.map(mapConversationToUI),
  });