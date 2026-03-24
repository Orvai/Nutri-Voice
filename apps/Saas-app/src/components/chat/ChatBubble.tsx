import { View, Text } from "react-native";
import { styles } from "./styles/ChatBubble.styles";

import type { UIMessage } from "@/types/ui/conversation/message.ui";

interface Props {
  message: UIMessage;
}

export default function ChatBubble({ message }: Props) {
  const isOutgoing = message.sender === "COACH" || message.sender === "AI";
  const isAI = message.sender === "AI";

  if (!message.text) return null;

  return (
    <View
      style={[
        styles.container,
        isOutgoing ? styles.outgoingContainer : styles.incomingContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOutgoing ? styles.outgoingBubble : styles.incomingBubble,
          isAI && styles.aiOutgoingBubble,
        ]}
      >
        {isAI && <Text style={styles.botLabel}>בוט</Text>}
        <Text
          style={[
            styles.messageText,
            isOutgoing ? styles.outgoingMessageText : styles.incomingMessageText,
          ]}
        >
          {message.text}
        </Text>

        <Text
          style={[
            styles.timeText,
            isOutgoing ? styles.outgoingTimeText : styles.incomingTimeText,
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
