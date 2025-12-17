import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { UIFoodItem } from "../../types/ui/nutrition/nutrition.types";

type Props = {
  item: UIFoodItem;
  editable: boolean;
  onChangeGrams: (grams: number) => void;
  onRemove: () => void;
};

export default function MealOptionItem({
  item,
  editable,
  onChangeGrams,
  onRemove,
}: Props) {
  const [gramsInput, setGramsInput] = useState(
    item.grams.toString()
  );

  const totalCalories = useMemo(() => {
    if (item.caloriesPer100g == null) return null;

    const calories = (item.grams / 100) * item.caloriesPer100g;
    return Math.round(calories);
  }, [item.caloriesPer100g, item.grams]);

  useEffect(() => {
    setGramsInput(item.grams.toString());
  }, [item.grams]);

  const handleBlur = () => {
    const parsed = parseInt(gramsInput, 10);
    if (Number.isNaN(parsed)) return;

    onChangeGrams(parsed);
  };

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
          backgroundColor: item.color,
          borderRadius: 5,
        }}
      />

      <Text style={{ flex: 1 }}>{item.name}</Text>

      <TextInput
        value={gramsInput}
        onChangeText={setGramsInput}
        onBlur={handleBlur}
        editable={editable}
        keyboardType="numeric"
        style={{
          width: 60,
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 6,
          textAlign: "center",
          paddingVertical: 4,
          backgroundColor: editable ? "#fff" : "#f3f4f6",
        }}
      />

      <Text style={{ color: "#6b7280", fontSize: 12 }}>גרם</Text>

      <Text style={{ fontWeight: "600" }}>
        {totalCalories != null ? `${totalCalories} קק״ל` : "-"}
      </Text>

      {editable && (
        <Pressable
          onPress={onRemove}
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
          <Ionicons name="close" size={16} color="#dc2626" />
        </Pressable>
      )}
    </View>
  );
}