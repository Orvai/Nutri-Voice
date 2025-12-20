// src/hooks/conversation/useSendCoachMessage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postApiConversationsIdMessages,
} from "@common/api/sdk/nutri-api";
import type { SendCoachMessageRequestDto } 
  from "@common/api/sdk/schemas";
import { conversationKeys } from "@/queryKeys/conversationKeys";

export const useSendCoachMessage = (conversationId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendCoachMessageRequestDto) =>
      postApiConversationsIdMessages(conversationId, payload),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: conversationKeys.messages(conversationId),
      });
    },
  });
};
