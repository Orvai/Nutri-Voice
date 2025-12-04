// src/components/nutrition/MealOptionsBlock.tsx
import { View, Text, Pressable } from "react-native";
import MealFoodItem from "./MealFoodItem";
import { UIMealOption } from "../../types/nutrition-ui";

type Props = {
  option: UIMealOption;
};

export default function MealOptionsBlock({ option }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: option.isSelected ? "#4f46e5" : "#c7d2fe",
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: option.isSelected ? "#4f46e5" : "#4b5563",
          }}
        >
          {option.title}
        </Text>

        <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8 }}>
          {option.totalCalories != null && (
            <Text style={{ fontSize: 12, color: "#6b7280" }}>
              {option.totalCalories} קק״ל
            </Text>
          )}
          {option.isSelected && (
            <Text style={{ fontSize: 11, color: "#16a34a" }}>אופציה נבחרת</Text>
          )}
        </View>
      </View>

      {option.foods.map((food) => (
        <MealFoodItem key={food.id} food={food} />
      ))}

      <Pressable
        style={{ marginTop: 8 }}
        onPress={() => {
          console.log("TODO: open add-food flow");
        }}
      >
        <Text style={{ color: "#2563eb", fontSize: 13 }}>+ הוסף מוצר</Text>
      </Pressable>
    </View>
  );
}
