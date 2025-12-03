import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AiStatsCard({ data }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 18,
        borderRadius: 18,
        marginBottom: 20,
      }}
    >
      {data.map((row, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 15, color: "#374151" }}>{row.label}</Text>

          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: row.color,
              }}
            >
              <Text style={{ fontWeight: "700", color: row.textColor }}>
                {row.value}
              </Text>
            </View>

            <Ionicons
              name={row.icon}
              size={16}
              color={row.textColor}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
