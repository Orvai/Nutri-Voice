import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApiMessagesIdHandled } from "@common/api/sdk/nutri-api";
import { conversationKeys } from "@/queryKeys/conversationKeys";

type MarkMessageHandledPayload = {
  messageId: string;
  handledBy: "COACH" | "AI";
};

export const useMarkMessageHandled = (conversationId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, handledBy }: MarkMessageHandledPayload) =>
      postApiMessagesIdHandled(messageId, { handledBy }),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: conversationKeys.messages(conversationId),
      });
    },
  });
};
