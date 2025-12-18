// src/components/nutrition/MealFoodItem.tsx
import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UIFoodItem } from "../../types/ui/nutrition/nutrition.types";
import { styles } from "./styles/MealFoodItem.styles";

type Props = {
  food: UIFoodItem;
  onRemove?: () => void;
  removing?: boolean;
};

export default function MealFoodItem({ food, onRemove, removing }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.icon, { backgroundColor: food.color }]} />

      <Text style={styles.text}>{food.name}</Text>

      <TextInput
        defaultValue={food.grams.toString()}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.subtext}>גרם</Text>

      <Text style={styles.value}>
        {food.caloriesPer100g != null ? `${food.caloriesPer100g} קק״ל` : "-"}
      </Text>

      {onRemove && (
        <Pressable
          onPress={onRemove}
          disabled={removing}
          style={styles.button}
        >
          <Ionicons
            name="close"
            size={16}
            color="#dc2626"
            style={[styles.iconClose, removing && styles.iconCloseDisabled]}
          />
        </Pressable>
      )}
    </View>
  );
}