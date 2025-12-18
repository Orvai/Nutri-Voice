import { View, Text } from "react-native";
import { styles } from "./styles/ChatBubble.styles";

export default function ChatBubble({ message }) {
  const isCoach = message.from === "coach";

  return (
    <View
      style={[styles.container, { justifyContent: isCoach ? "flex-end" : "flex-start" }]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isCoach ? "#2563eb" : "#fff",
            borderTopLeftRadius: isCoach ? 14 : 0,
            borderTopRightRadius: isCoach ? 0 : 14,
          },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isCoach ? "#fff" : "#111827", textAlign: isCoach ? "left" : "right" },
          ]}
        >
          {message.text}
        </Text>

        <Text
          style={[
            styles.timeText,
            { color: isCoach ? "#e0e7ff" : "#6b7280", textAlign: isCoach ? "left" : "right" },
          ]}
        >
          {message.time}
        </Text>
      </View>
    </View>
  );
}