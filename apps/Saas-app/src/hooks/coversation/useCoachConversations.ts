import { useQuery } from "@tanstack/react-query";
import { getApiConversations } from "@common/api/sdk/nutri-api";
import { conversationKeys } from "@/queryKeys/conversationKeys";
import { mapConversationToUI } from "@/mappers/conversation/conversation.mapper";
import { REALTIME_INTERVAL_MS } from "@/hooks/realtime/realtime.constants";

export const useCoachConversations = (coachId?: string) =>
  useQuery({
    queryKey: coachId
      ? conversationKeys.listByCoach(coachId)
      : conversationKeys.all,
    queryFn: ({ signal }) =>
      getApiConversations(signal),
    refetchInterval: REALTIME_INTERVAL_MS.conversations,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
    select: (res) => res.map(mapConversationToUI),
  });
