// src/components/nutrition/MealBlock.tsx
import { View, Text } from "react-native";
import MealOptionsBlock from "./MealOptionsBlock";
import { UIMeal } from "../../types/nutrition-ui";

type Props = {
  meal: UIMeal;
};

export default function MealBlock({ meal }: Props) {
  const sortedOptions = [...meal.options].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );
  const isSingleOption = sortedOptions.length === 1;
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
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>{meal.title}</Text>
          {meal.timeRange ? (
            <Text style={{ fontSize: 13, color: "#6b7280" }}>
              {meal.timeRange}
            </Text>
          ) : null}
        </View>

        <View style={{ flexDirection: "row-reverse", gap: 10 }}>
          <Text style={{ color: "#2563eb" }}>📝</Text>
          <Text style={{ color: "#dc2626" }}>🗑️</Text>
        </View>
      </View>

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

      {isSingleOption ? (
        <MealOptionsBlock option={sortedOptions[0]} hideTitle />
      ) : (
        sortedOptions.map((opt) => (
          <MealOptionsBlock key={opt.id} option={opt} />
        ))
      )}
    </View>
  );
}
