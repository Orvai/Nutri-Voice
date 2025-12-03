import { View, Text, Pressable } from "react-native";
import MealFoodItem from "./MealFoodItem";

export default function MealOptionsBlock({ option }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#c7d2fe",
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "700",
          color: option.color,
          marginBottom: 12,
        }}
      >
        {option.title}
      </Text>

      {option.foods.map((food) => (
        <MealFoodItem key={food.id} food={food} />
      ))}

      <Pressable style={{ marginTop: 8 }}>
        <Text style={{ color: "#2563eb", fontSize: 13 }}>+ הוסף מוצר</Text>
      </Pressable>
    </View>
  );
}
