import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TodayMeals({ meals }) {
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
        דיווחי ארוחות
      </Text>

      {meals.map((m) => (
        <View
          key={m.id}
          style={{
            padding: 14,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 12,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <View style={{ flexDirection: "row-reverse", gap: 8 }}>
              <Ionicons name={m.icon} size={20} color="#555" />
              <Text style={{ fontWeight: "700" }}>{m.title}</Text>
            </View>

            {m.fromPlan && (
              <Text
                style={{
                  backgroundColor: "#ecfdf5",
                  color: "#0f766e",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                  fontSize: 12,
                }}
              >
                מהתפריט
              </Text>
            )}
          </View>

          <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
            דווח ב־{m.time}
          </Text>

          <Text style={{ fontSize: 14, marginBottom: 10 }}>{m.description}</Text>

          <View style={{ flexDirection: "row-reverse", gap: 14 }}>
            <Text style={{ fontSize: 12, color: "#6b7280" }}>
              🔥 {m.calories} קל'
            </Text>
            <Text style={{ fontSize: 12, color: "#6b7280" }}>
              חלבון: {m.protein}g
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
