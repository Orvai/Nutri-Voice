import { View, Text } from "react-native";

export default function ChatBubble({ message }) {
  const isCoach = message.from === "coach";

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: isCoach ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={{
          maxWidth: "75%",
          backgroundColor: isCoach ? "#2563eb" : "#fff",
          padding: 12,
          borderRadius: 14,
          borderTopLeftRadius: isCoach ? 14 : 0,
          borderTopRightRadius: isCoach ? 0 : 14,
        }}
      >
        <Text
          style={{
            color: isCoach ? "#fff" : "#111827",
            fontSize: 15,
            textAlign: isCoach ? "left" : "right",
          }}
        >
          {message.text}
        </Text>

        <Text
          style={{
            color: isCoach ? "#e0e7ff" : "#6b7280",
            marginTop: 6,
            fontSize: 11,
            textAlign: isCoach ? "left" : "right",
          }}
        >
          {message.time}
        </Text>
      </View>
    </View>
  );
}
