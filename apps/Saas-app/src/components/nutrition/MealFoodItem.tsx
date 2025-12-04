// src/components/nutrition/MealFoodItem.tsx
import { View, Text, TextInput } from "react-native";
import { UIFoodItem } from "../../types/nutrition-ui";

type Props = {
  food: UIFoodItem;
};

export default function MealFoodItem({ food }: Props) {
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          backgroundColor: food.color,
          borderRadius: 5,
        }}
      />

      <Text style={{ flex: 1 }}>{food.name}</Text>

      <TextInput
        defaultValue={food.grams.toString()}
        keyboardType="numeric"
        style={{
          width: 60,
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 6,
          textAlign: "center",
          paddingVertical: 4,
        }}
      />

      <Text style={{ color: "#6b7280", fontSize: 12 }}>גרם</Text>

      <Text style={{ fontWeight: "600" }}>
        {food.calories != null ? `${food.calories} קק״ל` : "-"}
      </Text>

      <Text style={{ color: "#dc2626", fontSize: 18 }}>✖</Text>
    </View>
  );
}
