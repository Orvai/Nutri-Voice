import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TodayWorkout({ workout }) {
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
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700" }}>אימון היום</Text>
        <Text
          style={{
            backgroundColor: "#ecfdf5",
            color: "#0f766e",
            fontSize: 12,
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 10,
          }}
        >
          {workout.done ? "הושלם" : "לא הושלם"}
        </Text>
      </View>

      <View
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          borderRadius: 12,
        }}
      >
        <View style={{ flexDirection: "row-reverse", gap: 10, marginBottom: 12 }}>
          <View style={{ backgroundColor: "#eff6ff", padding: 10, borderRadius: 12 }}>
            <Ionicons name="barbell" size={20} color="#2563eb" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "700" }}>{workout.title}</Text>
            <Text style={{ color: "#6b7280", fontSize: 12 }}>{workout.time}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Box label="משך" value={workout.duration} />
          <Box label="קלוריות" value={workout.calories} />
        </View>
      </View>
    </View>
  );
}

function Box({ label, value }) {
  return (
    <View
      style={{
        backgroundColor: "#f9fafb",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        flex: 1,
      }}
    >
      <Text style={{ fontSize: 12, color: "#6b7280" }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}
