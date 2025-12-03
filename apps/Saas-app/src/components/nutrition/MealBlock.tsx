import { View, Text } from "react-native";
import MealOptionsBlock from "./MealOptionsBlock";

export default function MealBlock({ meal }) {
  return (
    <View
      style={{
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 20,
        padding: 16,
      }}
    >
      {/* כותרת הארוחה */}
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>{meal.title}</Text>
          <Text style={{ fontSize: 13, color: "#6b7280" }}>{meal.timeRange}</Text>
        </View>

        <View style={{ flexDirection: "row-reverse", gap: 10 }}>
          <Text style={{ color: "#2563eb" }}>📝</Text>
          <Text style={{ color: "#dc2626" }}>🗑️</Text>
        </View>
      </View>

      {/* הערות */}
      <View
        style={{
          backgroundColor: "#fef9c3",
          borderColor: "#fde047",
          borderWidth: 1,
          padding: 8,
          borderRadius: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#ca8a04", fontSize: 12 }}>
          {meal.notes || "הערות לארוחה..."}
        </Text>
      </View>

      {/* כל האופציות */}
      {meal.options.map((opt) => (
        <MealOptionsBlock key={opt.id} option={opt} />
      ))}
    </View>
  );
}
