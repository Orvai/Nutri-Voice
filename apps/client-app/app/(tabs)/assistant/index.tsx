import { useEffect, useRef } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusView } from "@/components/ui/StatusView";
import { AssistantQuickActions } from "@/components/assistant/AssistantQuickActions";
import { AssistantMessageBubble } from "@/components/assistant/AssistantMessageBubble";
import { AssistantComposer } from "@/components/assistant/AssistantComposer";
import { AssistantEscalationCard } from "@/components/assistant/AssistantEscalationCard";
import { CoachHelpFallback } from "@/components/shared/CoachHelpFallback";
import { useAssistantState } from "@/hooks/assistant/useAssistantState";
import { useAssistantActions } from "@/hooks/assistant/useAssistantActions";
import { colors } from "@/constants/colors";

export default function AssistantScreen() {
  const params = useLocalSearchParams<{ prompt?: string | string[] }>();
  const prompt = Array.isArray(params.prompt) ? params.prompt[0] : params.prompt;
  const lastPromptRef = useRef<string | null>(null);

  const { state, isLoading, isError, refetch } = useAssistantState();
  const {
    sendMessage,
    runQuickAction,
    escalate,
    isSending,
    isRunningQuickAction,
    isEscalating,
    error
  } = useAssistantActions();

  useEffect(() => {
    if (!prompt || prompt === lastPromptRef.current) {
      return;
    }

    lastPromptRef.current = prompt;
    void sendMessage(prompt);
  }, [prompt, sendMessage]);

  if (isLoading) {
    return (
      <Screen>
        <StatusView type="loading" title="פותח את העוזר" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <CoachHelpFallback onRetry={() => void refetch()} />
      </Screen>
    );
  }

  if (!state) {
    return (
      <Screen>
        <StatusView type="empty" title="אין תוכן בעוזר" />
      </Screen>
    );
  }

  return (
    <Screen scroll={false} contentContainerStyle={{ flex: 1 }}>
      <SectionHeader title="עוזר" />

      <AssistantQuickActions
        disabled={isRunningQuickAction}
        onAction={async (action) => {
          await runQuickAction(action);
          if (action === "meal") {
            router.push("/nutrition/report");
          }
          if (action === "workout") {
            router.push("/(tabs)/workout");
          }
        }}
      />

      <View style={styles.chatWrap}>
        <ScrollView
          style={styles.chat}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {state.messages.map((message) => (
            <AssistantMessageBubble key={message.id} message={message} />
          ))}
        </ScrollView>

        <AssistantComposer
          disabled={isSending}
          onSend={async (text) => {
            await sendMessage(text);
          }}
        />
      </View>

      <AssistantEscalationCard
        pending={state.pendingCoachReply}
        loading={isEscalating}
        onEscalate={async () => {
          await escalate("צריך עזרת מאמן בנושא הזה");
        }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chatWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.surface,
    padding: 12
  },
  chat: {
    flex: 1
  },
  chatContent: {
    gap: 10,
    paddingBottom: 12
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    textAlign: "right"
  }
});
