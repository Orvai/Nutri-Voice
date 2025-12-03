import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AiWelcome() {
  return (
    <View style={{ alignItems: "center", marginBottom: 30, marginTop: 10 }}>
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: "#eef2ff",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Ionicons name="sparkles" size={32} color="#2563eb" />
      </View>

      <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
        שלום! אני העוזר האישי שלך
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#6b7280",
          marginTop: 6,
          textAlign: "center",
        }}
      >
        אני כאן כדי לעזור לך לנהל לקוחות, לנתח נתונים וליצור תוכניות מותאמות אישית
      </Text>
    </View>
  );
}
