import { StyleSheet, Text, View } from "react-native";
import type { AssistantMessage } from "@/types/assistant/assistant.ui";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type AssistantMessageBubbleProps = {
  message: AssistantMessage;
};

export function AssistantMessageBubble({ message }: AssistantMessageBubbleProps) {
  const isUser = message.role === "user";

  const backgroundColor = isUser
    ? colors.neon
    : message.kind === "escalation"
    ? "rgba(255,75,75,0.2)"
    : colors.surfaceElevated;

  const textColor = isUser ? colors.black : colors.white;

  return (
    <View style={[styles.wrapper, isUser ? styles.userAlign : styles.assistantAlign]}>
      <View style={[styles.bubble, { backgroundColor }]}>
        <Text style={[styles.messageText, { color: textColor }]}>{message.text}</Text>
        <Text style={[styles.time, { color: isUser ? "#2d2d2d" : colors.textMuted }]}>
          {message.createdAtLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%"
  },
  userAlign: {
    alignItems: "flex-start"
  },
  assistantAlign: {
    alignItems: "flex-end"
  },
  bubble: {
    maxWidth: "86%",
    borderRadius: radius.md,
    padding: spacing.sm,
    borderColor: colors.border,
    borderWidth: 1,
    gap: 4
  },
  messageText: {
    textAlign: "right",
    fontSize: 14,
    lineHeight: 20
  },
  time: {
    textAlign: "right",
    fontSize: 11
  }
});
