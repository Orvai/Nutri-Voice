import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import MealFoodItem from "./MealFoodItem";
import { UIMealOption } from "../../types/nutrition-ui";
import FoodPickerModal from "./FoodPickerModal";
import { useUpdateMealTemplate } from "../../hooks/nutrition/useUpdateMealTemplate";

function categoryToRole(category?: string) {
  switch (category) {
    case "PROTEIN":
      return "PROTEIN";
    case "CARB":
      return "CARB";
    case "FREE":
      return "FREE";
    case "HEALTH":
      return "HEALTH";
    case "MENTAL_HEALTH":
      return "MENTAL_HEALTH";
    default:
      return "FREE"; 
  }
}

type Props = {
  option: UIMealOption;
  hideTitle?: boolean;
};

export default function MealOptionsBlock({ option, hideTitle = false }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const updateTemplate = useUpdateMealTemplate(option.mealTemplateId);

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
      {/* Title */}
      {!hideTitle && (
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
      )}

      {/* Food items */}
      {option.foods.map((food) => (
        <MealFoodItem key={food.id} food={food} />
      ))}

      {/* Add Food Button */}
      <Pressable style={{ marginTop: 8 }} onPress={() => setPickerOpen(true)}>
        <Text style={{ color: "#2563eb", fontSize: 13 }}>+ הוסף מוצר</Text>
      </Pressable>

      {/* Modal */}
      <FoodPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        existingIds={option.foods.map((f) => f.id)}
        onSelect={(food) => {
          const role = categoryToRole(food.category);

          updateTemplate.mutate({
            itemsToAdd: [
              {
                foodItemId: food.id,
                role,
                defaultGrams: 100,
              },
            ],
          });

          setPickerOpen(false);
        }}
      />
    </View>
  );
}
