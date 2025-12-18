// src/components/nutrition/MealOptionsBlock.tsx
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";

import {
  UIMealOption,
  UINutritionSource,
  UIFoodItem,
  UITemplateMealOption,
} from "../../types/ui/nutrition/nutrition.types";

import MealOptionItem from "./MealOptionItem";
import FoodPickerModal from "./FoodPickerModal";
import { styles } from "./styles/MealOptionsBlock.styles";
import { useNutritionMenuMutation } from "@/hooks/composition/useNutritionMenuMutation";

type Props = {
  option: UIMealOption;
  mealId: string;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  menuId: string;
  menuSource: UINutritionSource;
};

export default function MealOptionsBlock({
  option,
  isSelected,
  mealId,
  onSelect,
  onRemove,
  menuId,
  menuSource,
}: Props) {
  const menuActions = useNutritionMenuMutation(menuSource);

  const [pickerOpen, setPickerOpen] = useState(false);

  const canEditItems =
  menuSource === "client" || menuSource === "template";

  function isTemplateMealOption(
    option: UIMealOption
  ): option is UITemplateMealOption {
    return "mealTemplateId" in option;
  }

  /* =========================
     Item handlers (client)
  ========================= */

  const handleAddItem = (food: {
    id: string;
    name: string;
    caloriesPer100g?: number | null;
  }) => {
    if (menuSource === "client") {
      menuActions.addClientItem(menuId,mealId, option.id, {
        foodItemId: food.id,
        role: "FREE",
        grams: 100,
      });
    }
  
    if (menuSource === "template" && isTemplateMealOption(option)) {
      menuActions.addTemplateItem(option.mealTemplateId, {
        foodItemId: food.id,
        role: "FREE",
        grams: 100,
      });
    }
  
    setPickerOpen(false);
  };

  const handleUpdateItem = (item: UIFoodItem, grams: number) => {
    if (!canEditItems) return;

    if (menuSource === "client") {
      menuActions.updateClientItem(menuId,option.id,mealId, {
        id: item.id,
        grams,
      });
      return;
    }

    if (menuSource === "template" && isTemplateMealOption(option)) {
      menuActions.updateTemplateItem(option.mealTemplateId, {
        id: item.id,
        grams,
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (menuSource === "client") {
      menuActions.removeClientItem(menuId,mealId, option.id, itemId);
      return;
    }

    if (menuSource === "template" && isTemplateMealOption(option)) {
      menuActions.removeTemplateItem(option.mealTemplateId, itemId);
    }
  };

  /* =========================
     Render
  ========================= */

  return (
    <View
      style={[
        styles.container,
        isSelected ? styles.containerActive : styles.containerInactive,
      ]}
    >
      {/* Header */}
      <Pressable
        onPress={onSelect}
        style={styles.header}
      >
        <Text style={styles.title}>
          {option.title}
        </Text>

        <Pressable onPress={onRemove}>
          <Text style={styles.removeText}>
            הסר
          </Text>
        </Pressable>
      </Pressable>

      {/* Items */}
      {option.foods.map((item) => (
        <MealOptionItem
          key={item.id}
          item={item}
          editable={canEditItems}
          onChangeGrams={(grams) => handleUpdateItem(item, grams)}
          onRemove={() => handleRemoveItem(item.id)}
        />
      ))}

      {/* Add item */}
      {canEditItems && (
        <>
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>
              + הוסף מוצר
            </Text>
          </Pressable>

          <FoodPickerModal
            visible={pickerOpen}
            onClose={() => setPickerOpen(false)}
            existingIds={option.foods.map((f) => f.foodItemId)}
            onSelect={handleAddItem}
          />
        </>
      )}
    </View>
  );
}
