import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AiQuickActions() {
    const actions = [
        { icon: "fast-food-outline", title: "צור תוכנית תזונה" },
        { icon: "analytics-outline", title: "נתח ביצועים" },
        { icon: "document-outline", title: "סכם דוחות" },
        { icon: "barbell-outline", title: "תוכנית אימון" },
    ]as const;

  return (
    <View
      style={{
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 30,
        justifyContent: "center",
      }}
    >
      {actions.map((a, i) => (
        <Pressable
          key={i}
          style={{
            width: "45%",
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 10 }}>
            <View
              style={{
                backgroundColor: "#eff6ff",
                padding: 8,
                borderRadius: 10,
              }}
            >
              <Ionicons name={a.icon} size={24} color="#2563eb" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
              {a.title}
            </Text>
          </View>

          <Text
            style={{
              textAlign: "right",
              fontSize: 13,
              color: "#6b7280",
              marginTop: 8,
            }}
          >
            לחץ להתחלה
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
