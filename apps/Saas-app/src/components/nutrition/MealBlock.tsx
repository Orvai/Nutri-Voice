// src/components/nutrition/MealBlock.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, Modal } from "react-native";

import MealOptionsBlock from "./MealOptionsBlock";
import MealFoodItem from "./MealFoodItem";
import FoodPickerModal from "./FoodPickerModal";

import {
  UIFoodItem,
  UIMeal,
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
   Optionless Meal Foods
===================================== */

function OptionlessMealFoods({
  foods,
  mealTemplateId,
  mealId,
  menuId,
  menuSource,
}: {
  foods: UIFoodItem[];
  mealTemplateId: string;
  mealId: string;
    menuId: string;
  menuSource: UINutritionSource;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const menuActions = useNutritionMenuMutation(menuSource);

  const visibleFoods = useMemo(
    () => foods.filter((f) => !removedIds.includes(f.id)),
    [foods, removedIds]
  );

  const handleRemoveFood = (foodId: string) => {
    setRemovingIds((prev) => [...prev, foodId]);

    // food is removed by removing the meal option
    menuActions.removeMealOption(menuId, foodId);

    setRemovedIds((prev) => [...prev, foodId]);
    setRemovingIds((prev) => prev.filter((id) => id !== foodId));
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#4f46e5",
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
      }}
    >
      {visibleFoods.map((food) => (
        <MealFoodItem
          key={food.id}
          food={food}
          onRemove={() => handleRemoveFood(food.id)}
          removing={removingIds.includes(food.id)}
        />
      ))}

      <Pressable style={{ marginTop: 8 }} onPress={() => setPickerOpen(true)}>
        <Text style={{ color: "#2563eb", fontSize: 13 }}>+ הוסף מוצר</Text>
      </Pressable>

      <FoodPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        existingIds={foods.map((f) => f.id)}
        onSelect={(food) => {
          const defaultQuantity = 100;
          const caloriesPer100g = food.caloriesPer100g ?? 0;
          const calories = Math.round((defaultQuantity * caloriesPer100g) / 100);

          menuActions.addMealItem(menuId, mealId, {
            foodItemId: food.id,
            quantity: defaultQuantity,
            calories,
            notes: null,
          });
          setPickerOpen(false);
        }}
      />
    </View>
  );
}

/* =====================================
   MealBlock
===================================== */

type Props = {
  meal: UIMeal;
  menuId: string;
  menuSource: UINutritionSource;
};

export default function MealBlock({ meal, menuId, menuSource }: Props) {
  const menuActions = useNutritionMenuMutation(menuSource);

  const [removed, setRemoved] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [selectedOptionId, setSelectedOptionId] = useState(
    meal.selectedOptionId
  );
  const [caloriesInput, setCaloriesInput] = useState(
    meal.totalCalories?.toString() ?? ""
  );

  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");

  const sortedOptions = useMemo(
    () => [...meal.options].sort((a, b) => a.orderIndex - b.orderIndex),
    [meal.options]
  );

  useEffect(() => {
    setSelectedOptionId(meal.selectedOptionId);
  }, [meal.selectedOptionId]);

  useEffect(() => {
    setCaloriesInput(meal.totalCalories?.toString() ?? "");
  }, [meal.totalCalories]);

  const handleRemoveMeal = () => {
    setRemoving(true);
    menuActions.removeMeal(menuId, meal.id);
    setRemoved(true);
    setRemoving(false);
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    menuActions.selectMealOption(menuId, meal.id, optionId);
  };

  const handleCaloriesBlur = () => {
    const parsed = parseInt(caloriesInput, 10);
    const totalCalories = Number.isNaN(parsed) ? null : parsed;
    menuActions.updateMealCalories(menuId, meal.id, totalCalories);
  };

  const handleAddOption = () => {
    const trimmed = newOptionName.trim();
    if (!trimmed || !meal.mealTemplateId) return;

    menuActions.addMealOption(
      menuId,
      meal.id,
      meal.mealTemplateId,
      trimmed
    );

    setNewOptionName("");
    setOptionModalOpen(false);
  };

  const handleRemoveOption = (optionId: string) => {
    menuActions.removeMealOption(menuId, optionId);
  };

  if (removed) return null;

  return (
    <View
      style={{
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 20,
        padding: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>{meal.title}</Text>
          {meal.timeRange && (
            <Text style={{ fontSize: 13, color: "#6b7280" }}>
              {meal.timeRange}
            </Text>
          )}
        </View>

        <View style={{ flexDirection: "row-reverse", gap: 12 }}>
          <TextInput
            value={caloriesInput}
            onChangeText={setCaloriesInput}
            onBlur={handleCaloriesBlur}
            keyboardType="numeric"
            placeholder="קלוריות"
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 10,
              paddingHorizontal: 8,
              minWidth: 90,
              textAlign: "center",
              fontWeight: "600",
            }}
          />

          <Pressable
            onPress={handleRemoveMeal}
            disabled={removing}
            style={{
              backgroundColor: "#fee2e2",
              borderColor: "#fecaca",
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 6,
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
              הסר ארוחה
            </Text>
          </Pressable>
        </View>
      </View>

      {sortedOptions.length > 0 ? (
        sortedOptions.map((opt) => (
          <MealOptionsBlock
            key={opt.id}
            option={opt}
            mealId={meal.id}
            isSelected={opt.id === selectedOptionId}
            onSelect={() => handleSelectOption(opt.id)}
            onRemove={() => handleRemoveOption(opt.id)}
            menuId={menuId}
            menuSource={menuSource}
          />
        ))
      ) : meal.foods && meal.mealTemplateId ? (
        <OptionlessMealFoods
          foods={meal.foods}
          mealTemplateId={meal.mealTemplateId}
          mealId = {meal.id}
          menuId={menuId}
          menuSource={menuSource}
        />
      ) : null}

      <Pressable
        onPress={() => setOptionModalOpen(true)}
        style={{
          backgroundColor: "#eef2ff",
          borderColor: "#c7d2fe",
          borderWidth: 1,
          paddingVertical: 10,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <Text style={{ color: "#4338ca", fontWeight: "700" }}>
          הוסף אופציה
        </Text>
      </Pressable>

      {optionModalOpen && (
        <Modal transparent animationType="fade" visible>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.35)",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                padding: 16,
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "800" }}>
                שם האופציה
              </Text>

              <TextInput
                value={newOptionName}
                onChangeText={setNewOptionName}
                placeholder="לדוגמה: אופציה 1"
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  textAlign: "right",
                }}
              />

              <Pressable
                onPress={handleAddOption}
                style={{
                  backgroundColor: "#22c55e",
                  paddingVertical: 12,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  הוסף אופציה
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
