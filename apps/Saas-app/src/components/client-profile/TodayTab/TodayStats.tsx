import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TodayStats({ stats }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 16,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
        מדדים יומיים
      </Text>

      <View style={{ gap: 10 }}>
        {stats.map((s) => (
          <View
            key={s.label}
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              padding: 10,
              backgroundColor: "#f9fafb",
              borderRadius: 10,
            }}
          >
            <View style={{ flexDirection: "row-reverse", gap: 10, alignItems: "center" }}>
              <Ionicons name={s.icon} size={18} color="#2563eb" />
              <Text>{s.label}</Text>
            </View>
            <Text style={{ fontWeight: "700" }}>{s.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
