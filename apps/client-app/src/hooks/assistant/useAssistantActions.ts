import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  escalateAssistantToCoach,
  runAssistantQuickAction,
  sendAssistantMessage
} from "@/data/mocks/repositories/assistantMockRepository";
import { assistantKeys } from "@/queryKeys/assistantKeys";
import { homeKeys } from "@/queryKeys/homeKeys";
import { nutritionKeys } from "@/queryKeys/nutritionKeys";
import { workoutKeys } from "@/queryKeys/workoutKeys";

export function useAssistantActions() {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: assistantKeys.root() }),
      queryClient.invalidateQueries({ queryKey: homeKeys.root() }),
      queryClient.invalidateQueries({ queryKey: nutritionKeys.root() }),
      queryClient.invalidateQueries({ queryKey: workoutKeys.root() })
    ]);
  };

  const sendMutation = useMutation({
    mutationKey: assistantKeys.state(),
    mutationFn: sendAssistantMessage,
    onSuccess: () => {
      void invalidate();
    }
  });

  const quickActionMutation = useMutation({
    mutationKey: assistantKeys.quickActions(),
    mutationFn: runAssistantQuickAction,
    onSuccess: () => {
      void invalidate();
    }
  });

  const escalateMutation = useMutation({
    mutationKey: assistantKeys.quickActions(),
    mutationFn: escalateAssistantToCoach,
    onSuccess: () => {
      void invalidate();
    }
  });

  return {
    sendMessage: sendMutation.mutateAsync,
    runQuickAction: quickActionMutation.mutateAsync,
    escalate: escalateMutation.mutateAsync,
    isSending: sendMutation.isPending,
    isRunningQuickAction: quickActionMutation.isPending,
    isEscalating: escalateMutation.isPending,
    error:
      (sendMutation.error as Error | null)?.message ??
      (quickActionMutation.error as Error | null)?.message ??
      (escalateMutation.error as Error | null)?.message ??
      null
  };
}
