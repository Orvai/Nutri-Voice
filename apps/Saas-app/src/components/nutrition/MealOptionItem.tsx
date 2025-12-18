import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { UIFoodItem } from "../../types/ui/nutrition/nutrition.types";
import { styles } from "./styles/MealOptionItem.styles";

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
    <View style={styles.container}>
      <View style={[styles.icon, { backgroundColor: item.color }]} />

      <Text style={styles.text}>{item.name}</Text>

      <TextInput
        value={gramsInput}
        onChangeText={setGramsInput}
        onBlur={handleBlur}
        editable={editable}
        keyboardType="numeric"
        style={[
          styles.input,
          editable ? styles.inputEditable : styles.inputDisabled,
        ]}
      />

      <Text style={styles.subtext}>גרם</Text>

      <Text style={styles.value}>
        {totalCalories != null ? `${totalCalories} קק״ל` : "-"}
      </Text>

      {editable && (
        <Pressable
          onPress={onRemove}
          style={styles.button}
        >
          <Ionicons name="close" size={16} color="#dc2626" />
        </Pressable>
      )}
    </View>
  );
}