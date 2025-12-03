import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AiMessageBubble({ message }) {
  return (
    <View style={{ flexDirection: "row-reverse", gap: 10, marginBottom: 24 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#4f46e5",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="sparkles" size={18} color="#fff" />
      </View>

      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#eef2ff",
            padding: 14,
            borderRadius: 16,
            borderTopRightRadius: 0,
          }}
        >
          <Text style={{ color: "#1f2937", fontSize: 15, lineHeight: 22 }}>
            {message.text}
          </Text>
        </View>

        <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
          {message.time}
        </Text>
      </View>
    </View>
  );
}
