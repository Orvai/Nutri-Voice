// src/components/nutrition/MealBlock.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, Modal } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import MealOptionsBlock from "./MealOptionsBlock";
import MealFoodItem from "./MealFoodItem";
import FoodPickerModal from "./FoodPickerModal";
import { UIFoodItem, UIMeal, UINutritionSource } from "../../types/ui/nutrition-ui";
import {
  getMenuQueryKey,
  useNutritionMealTemplateMutation,
  useNutritionMenuMutation,
} from "../../hooks/nutrition/useNutritionMenuMutation";

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

function OptionlessMealFoods({
  foods,
  mealTemplateId,
  menuId,
  menuSource,
}: {
  foods: UIFoodItem[];
  mealTemplateId: string;
  menuId: string;
  menuSource: UINutritionSource;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [removedFoodIds, setRemovedFoodIds] = useState<string[]>([]);
  const [removingIds, setRemovingIds] = useState<string[]>([]);
  const updateTemplate = useNutritionMealTemplateMutation(
    mealTemplateId,
    menuId,
    menuSource
  );

  const visibleFoods = useMemo(
    () => foods.filter((food) => !removedFoodIds.includes(food.id)),
    [foods, removedFoodIds]
  );

  const handleRemoveFood = (foodId: string) => {
    setRemovingIds((prev) => [...prev, foodId]);

    updateTemplate.mutate(
      {
        itemsToDelete: [{ id: foodId }],
        mealTemplateId,
      },
      {
        onSuccess: () => {
          setRemovedFoodIds((prev) => [...prev, foodId]);
        },
        onSettled: () => {
          setRemovingIds((prev) => prev.filter((id) => id !== foodId));
        },
      }
    );
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
          const role = categoryToRole(food.category);

          updateTemplate.mutate({
            itemsToAdd: [
              {
                foodItemId: food.id,
                role,
                defaultGrams: 100,
              },
            ],
            mealTemplateId,
          });

          setPickerOpen(false);
        }}
      />
    </View>
  );
}

type Props = {
  meal: UIMeal;
  menuId: string;
  menuSource: UINutritionSource;
};

export default function MealBlock({ meal, menuId, menuSource }: Props) {
  const queryClient = useQueryClient();
  const sortedOptions = [...meal.options].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );
  const [removedOptionIds, setRemovedOptionIds] = useState<string[]>([]);
  const [removingOptionIds, setRemovingOptionIds] = useState<string[]>([]);
  const visibleOptions = useMemo(
    () => sortedOptions.filter((opt) => !removedOptionIds.includes(opt.id)),
    [removedOptionIds, sortedOptions]
  );
  const hasOptions = visibleOptions.length > 0;
  const [removed, setRemoved] = useState(false);
  const [removing, setRemoving] = useState(false);
  const updateMenu = useNutritionMenuMutation(menuId, menuSource);
    const [selectedOptionId, setSelectedOptionId] = useState(
    meal.selectedOptionId
  );
  const [caloriesInput, setCaloriesInput] = useState(
    meal.totalCalories?.toString() ?? ""
  );
  const [optionPickerOpen, setOptionPickerOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");
  const menuQueryKey = getMenuQueryKey(menuSource, menuId);

  useEffect(() => {
    setSelectedOptionId(meal.selectedOptionId);
  }, [meal.selectedOptionId]);

  useEffect(() => {
    setCaloriesInput(meal.totalCalories?.toString() ?? "");
  }, [meal.totalCalories]);

  const handleRemoveMeal = () => {
    setRemoving(true);

    updateMenu.mutate(
      { mealsToDelete: [{ id: meal.id }] },
      {
        onSuccess: () => setRemoved(true),
        onSettled: () => setRemoving(false),
      }
    );
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    updateMenu.mutate({
      mealsToUpdate: [
        {
          id: meal.id,
          selectedOptionId: optionId,
        },
      ],
    });
  };

  const handleCaloriesBlur = () => {
    const parsed = parseInt(caloriesInput, 10);
    const totalCalories = Number.isNaN(parsed) ? null : parsed;

    updateMenu.mutate({
      mealsToUpdate: [
        {
          id: meal.id,
          totalCalories,
        },
      ],
    });
  };

  const handleAddOption = () => {
    const trimmedName = newOptionName.trim();
    if (!trimmedName) return;

    updateMenu.mutate(
      {
        mealOptionsToAdd: [
          {
            mealId: meal.id,
            name: trimmedName,
          },
        ],
        },
        {
          onSuccess: (data) => {
            queryClient.setQueryData(menuQueryKey, data);
            setNewOptionName("");
            setOptionPickerOpen(false);
          },
        }
    );
  };

  const handleRemoveOption = (optionId: string) => {
    setRemovingOptionIds((prev) => [...prev, optionId]);

      updateMenu.mutate(
        { mealOptionsToDelete: [{ id: optionId }] },
        {
          onSuccess: (data) => {
            queryClient.setQueryData(menuQueryKey, data);
            setRemovedOptionIds((prev) => [...prev, optionId]);
          },
          onSettled: () => {
            setRemovingOptionIds((prev) => prev.filter((id) => id !== optionId));
          },
      }
    );
  };

  const renderedOptions = visibleOptions.map((opt) => ({
    ...opt,
    isSelected: selectedOptionId ? opt.id === selectedOptionId : opt.isSelected,
  }));

  if (removed) {
    return null;
  }
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
          {meal.timeRange ? (
            <Text style={{ fontSize: 13, color: "#6b7280" }}>
              {meal.timeRange}
            </Text>
          ) : null}
        </View>

        <View style={{ flexDirection: "row-reverse", gap: 12, alignItems: "center" }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 2,
              minWidth: 90,
            }}
          >
            <TextInput
              value={caloriesInput}
              onChangeText={setCaloriesInput}
              onBlur={handleCaloriesBlur}
              placeholder="קלוריות"
              keyboardType="numeric"
              style={{ textAlign: "center", fontWeight: "600", color: "#111827" }}
            />
          </View>

          <Pressable
            onPress={handleRemoveMeal}
            disabled={removing}
            style={{
              backgroundColor: "#fee2e2",
              borderColor: "#fecdd3",
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

      {hasOptions
        ? renderedOptions.map((opt) => (
            <MealOptionsBlock
              key={opt.id}
              option={opt}
              isSelected={opt.isSelected}
              onSelect={() => handleSelectOption(opt.id)}
              onRemove={() => handleRemoveOption(opt.id)}
              removing={removingOptionIds.includes(opt.id)}
              menuId={menuId}
              menuSource={menuSource}
            />
          ))
        : meal.foods && meal.mealTemplateId && (
            <OptionlessMealFoods
              foods={meal.foods}
              mealTemplateId={meal.mealTemplateId}
              menuId={menuId}
              menuSource={menuSource}
            />
          )}

      <Pressable
        onPress={() => setOptionPickerOpen(true)}
        style={{
          backgroundColor: "#eef2ff",
          borderColor: "#c7d2fe",
          borderWidth: 1,
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#4338ca", fontWeight: "700" }}>
          הוסף אופציה
        </Text>
      </Pressable>

      {optionPickerOpen && (
        <Modal transparent animationType="fade" visible={optionPickerOpen}>
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
              <View
                style={{
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "800" }}>
                  שם האופציה
                </Text>

                <Pressable onPress={() => setOptionPickerOpen(false)}>
                  <Text style={{ color: "#ef4444", fontWeight: "700" }}>
                    סגור
                  </Text>
                </Pressable>
              </View>

              <TextInput
                placeholder="לדוגמה: אופציה 1"
                value={newOptionName}
                onChangeText={setNewOptionName}
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
                <Text style={{ color: "white", fontWeight: "700", textAlign: "center" }}>
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