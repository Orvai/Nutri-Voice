import { View, Text } from "react-native";
import { styles } from "./styles/ChatBubble.styles";

import type { UIMessage } from "@/types/ui/conversation/message.ui";

interface Props {
  message: UIMessage;
}

export default function ChatBubble({ message }: Props) {
  const isCoach = message.sender === "COACH";
  const isClient = message.sender === "CLIENT";
  const isAI = message.sender === "AI";

  if (!message.text) return null;

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: isCoach ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isCoach
              ? "#2563eb"
              : isAI
              ? "#f3f4f6"
              : "#ffffff",

            borderTopLeftRadius: isCoach ? 14 : 0,
            borderTopRightRadius: isCoach ? 0 : 14,
          },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: isCoach ? "#ffffff" : "#111827",
              textAlign: isCoach ? "left" : "right",
            },
          ]}
        >
          {message.text}
        </Text>

        <Text
          style={[
            styles.timeText,
            {
              color: isCoach ? "#e0e7ff" : "#6b7280",
              textAlign: isCoach ? "left" : "right",
            },
          ]}
        >
          {new Date(message.createdAt).toLocaleTimeString("he-IL", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}
