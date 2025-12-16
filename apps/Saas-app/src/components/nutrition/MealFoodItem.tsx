// src/components/nutrition/MealFoodItem.tsx
import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UIFoodItem } from "../../types/ui/nutrition/nutrition.types";

type Props = {
  food: UIFoodItem;
  onRemove?: () => void;
  removing?: boolean;
};

export default function MealFoodItem({ food, onRemove, removing }: Props) {
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#99f6e4",
        padding: 10,
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
        {food.caloriesPer100g != null ? `${food.caloriesPer100g} קק״ל` : "-"}
      </Text>

      {onRemove && (
        <Pressable
          onPress={onRemove}
          disabled={removing}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fee2e2",
            borderWidth: 1,
            borderColor: "#fecaca",
          }}
        >
          <Ionicons
            name="close"
            size={16}
            color="#dc2626"
            style={{ opacity: removing ? 0.5 : 1 }}
          />
        </Pressable>
      )}
    </View>
  );
}