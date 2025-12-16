import React, { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";

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
        justifyContent: "space-between",
        paddingVertical: 6,
      }}
    >
      {/* Name */}
      <Text style={{ fontSize: 14, fontWeight: "500" }}>
        {item.name}
      </Text>

      {/* Controls */}
      <View
        style={{
          flexDirection: "row-reverse",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Grams */}
        <TextInput
          value={gramsInput}
          onChangeText={setGramsInput}
          onBlur={handleBlur}
          editable={editable}
          keyboardType="numeric"
          style={{
            width: 70,
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 8,
            paddingHorizontal: 6,
            paddingVertical: 4,
            textAlign: "center",
            backgroundColor: editable ? "#fff" : "#f3f4f6",
          }}
        />

        <Text style={{ fontSize: 12, color: "#6b7280" }}>
          גרם
        </Text>

        {/* Remove */}
        {editable && (
          <Pressable onPress={onRemove}>
            <Text
              style={{
                color: "#ef4444",
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              הסר
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
