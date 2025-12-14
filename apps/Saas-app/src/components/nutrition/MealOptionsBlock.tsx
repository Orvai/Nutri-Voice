// src/components/nutrition/MealOptionsBlock.tsx
import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";

import MealFoodItem from "./MealFoodItem";
import FoodPickerModal from "./FoodPickerModal";

import {
  UIMealOption,
  UINutritionSource,
} from "../../types/ui/nutrition/nutrition.types";

import { useNutritionMenuMutation } from "@/hooks/composition/useNutritionMenuMutation";

/* =====================================
   Helpers
===================================== */

function categoryToRole(category?: string) {
  switch (category) {
    case "PROTEIN":
      return "PROTEIN";
    case "CARB":
      return "CARB";
    case "HEALTH":
      return "HEALTH";
    case "MENTAL_HEALTH":
      return "MENTAL_HEALTH";
    default:
      return "FREE";
  }
}

/* =====================================
   Component
===================================== */

type Props = {
  option: UIMealOption;
  mealId: string; 
  hideTitle?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  removing?: boolean;
  menuId: string;
  menuSource: UINutritionSource;
};

export default function MealOptionsBlock({
  option,
  mealId,
  hideTitle = false,
  isSelected,
  onSelect,
  onRemove,
  removing = false,
  menuId,
  menuSource,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [removedFoodIds, setRemovedFoodIds] = useState<string[]>([]);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const menuActions = useNutritionMenuMutation(menuSource);

  const visibleFoods = useMemo(
    () => option.foods.filter((f) => !removedFoodIds.includes(f.id)),
    [option.foods, removedFoodIds]
  );

  const handleRemoveFood = (foodId: string) => {
    setRemovingIds((prev) => [...prev, foodId]);

    // Removing food = removing meal option item
    menuActions.removeMealOption(menuId, foodId);

    setRemovedFoodIds((prev) => [...prev, foodId]);
    setRemovingIds((prev) => prev.filter((id) => id !== foodId));
  };

  const optionSelected = isSelected ?? option.isSelected;

  return (
    <Pressable
      onPress={onSelect}
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: optionSelected ? "#a855f7" : "#c7d2fe",
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
              color: optionSelected ? "#7e22ce" : "#4b5563",
            }}
          >
            {option.title}
          </Text>

          {onRemove && (
            <Pressable
              onPress={onRemove}
              disabled={removing}
              style={{
                backgroundColor: "#fee2e2",
                borderColor: "#fecdd3",
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "#b91c1c",
                  fontWeight: "700",
                  opacity: removing ? 0.5 : 1,
                }}
              >
                מחק אופציה
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Foods */}
      {visibleFoods.map((food) => (
        <MealFoodItem
          key={food.id}
          food={food}
          onRemove={() => handleRemoveFood(food.id)}
          removing={removingIds.includes(food.id)}
        />
      ))}

      {/* Add Food */}
      <Pressable style={{ marginTop: 8 }} onPress={() => setPickerOpen(true)}>
        <Text style={{ color: "#2563eb", fontSize: 13 }}>+ הוסף מוצר</Text>
      </Pressable>

      {/* Picker */}
      <FoodPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        existingIds={option.foods.map((f) => f.id)}
        onSelect={(food) => {
          menuActions.addMealOption(
            menuId,
            mealId,
            food.id,
            categoryToRole(food.category)
          );
          setPickerOpen(false);
        }}
      />
    </Pressable>
  );
}
