+117
-10

// src/components/nutrition/MealBlock.tsx
import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import MealOptionsBlock from "./MealOptionsBlock";
import MealFoodItem from "./MealFoodItem";
import FoodPickerModal from "./FoodPickerModal";
import { UIFoodItem, UIMeal } from "../../types/ui/nutrition-ui";
import { useUpdateMealTemplate } from "../../hooks/nutrition/useUpdateMealTemplate";
import { useUpdateTemplateMenu } from "../../hooks/nutrition/useUpdateTemplateMenu";

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
}: {
  foods: UIFoodItem[];
  mealTemplateId: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [removedFoodIds, setRemovedFoodIds] = useState<string[]>([]);
  const [removingIds, setRemovingIds] = useState<string[]>([]);
  const updateTemplate = useUpdateMealTemplate(mealTemplateId);

  const visibleFoods = useMemo(
    () => foods.filter((food) => !removedFoodIds.includes(food.id)),
    [foods, removedFoodIds]
  );

  const handleRemoveFood = (foodId: string) => {
    setRemovingIds((prev) => [...prev, foodId]);

    updateTemplate.mutate(
      {
        itemsToDelete: [{ id: foodId }],
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
          });

          setPickerOpen(false);
        }}
      />
    </View>
  );
}

type Props = {
  meal: UIMeal;
  templateMenuId: string;
};

export default function MealBlock({ meal, templateMenuId }: Props) {  
  const sortedOptions = [...meal.options].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );
  const hasOptions = sortedOptions.length > 0;
  const [removed, setRemoved] = useState(false);
  const [removing, setRemoving] = useState(false);
  const updateMenu = useUpdateTemplateMenu(templateMenuId);

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
          {meal.totalCalories != null && (
            <Text style={{ color: "#6b7280", fontWeight: "600" }}>
              {meal.totalCalories} קק״ל
            </Text>
          )}

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


      <View
        style={{
          backgroundColor: "#fef9c3",
          borderColor: "#fde047",
          borderWidth: 1,
          padding: 8,
          borderRadius: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#ca8a04", fontSize: 12 }}>
          {meal.notes || "הערות לארוחה..."}
        </Text>
      </View>

      {hasOptions
        ? sortedOptions.map((opt) => (
            <MealOptionsBlock key={opt.id} option={opt} />
          ))
        : meal.foods && meal.mealTemplateId && (
            <OptionlessMealFoods
              foods={meal.foods}
              mealTemplateId={meal.mealTemplateId}
            />
          )}
    </View>
  );
}