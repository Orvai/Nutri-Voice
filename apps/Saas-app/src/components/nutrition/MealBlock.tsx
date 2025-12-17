// src/components/nutrition/MealBlock.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, Modal } from "react-native";

import MealOptionsBlock from "./MealOptionsBlock";

import { UIMeal, UINutritionSource } from "../../types/ui/nutrition/nutrition.types";
import { useNutritionMenuMutation } from "@/hooks/composition/useNutritionMenuMutation";

type Props = {
  meal: UIMeal;
  menuId: string;
  menuSource: UINutritionSource;
};

export default function MealBlock({ meal, menuId, menuSource }: Props) {
  const menuActions = useNutritionMenuMutation(menuSource);

  const [removed, setRemoved] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    meal.selectedOptionId ?? null
  );

  const [caloriesInput, setCaloriesInput] = useState(
    meal.totalCalories?.toString() ?? ""
  );

  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");




  /* =========================
     Sync external changes
  ========================= */

  useEffect(() => {
    setSelectedOptionId(meal.selectedOptionId ?? null);
  }, [meal.selectedOptionId]);

  useEffect(() => {
    setCaloriesInput(meal.totalCalories?.toString() ?? "");
  }, [meal.totalCalories]);

  /* =========================
     Handlers
  ========================= */

  const handleRemoveMeal = () => {
    setRemoving(true);
    menuActions.removeMeal(menuId, meal.id);
    setRemoved(true);
    setRemoving(false);
  };

  const handleSelectOption = (optionId: string) => {
    // Only client menus have selection
    if (menuSource !== "client") return;

    setSelectedOptionId(optionId);
    menuActions.selectMealOption(menuId, meal.id, optionId);
  };

  const handleCaloriesBlur = () => {
    const parsed = parseInt(caloriesInput, 10);
    const totalCalories = Number.isNaN(parsed) ? null : parsed;

    menuActions.updateMeal(menuId, meal.id, { totalCalories });
  };

  const handleAddOption = () => {
    const trimmed = newOptionName.trim();
    if (!trimmed) return;
  
    /* ======================
       CLIENT MENU
    ====================== */
    if (menuSource === "client") {
      menuActions.addMealOption(menuId, {
        mealId: meal.id,
        name: trimmed,
        items: [], 
      });
  
      setNewOptionName("");
      setOptionModalOpen(false);
      return;
    }
  
    /* ======================
       TEMPLATE MENU
    ====================== */
  

    menuActions.addMealOption(menuId, {
      mealId: meal.id,
      name: trimmed,
      template: {
        name: trimmed,          
        kind: "FREE_CALORIES",  
        items: [],              
      },
    });
  
    setNewOptionName("");
    setOptionModalOpen(false);
  };

  const handleRemoveOption = (optionId: string,mealID:string) => {
    menuActions.removeMealOption(menuId,mealID ,optionId);
  };

  if (removed) return null;

  /* =========================
     Render
  ========================= */

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
      {/* Header */}
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
          {/* Calories input (editable) */}
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

          {/* Remove meal */}
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

      {/* Options (NO sorting - backend order) */}
      {meal.options.map((opt) => (
        <MealOptionsBlock
          key={opt.id}
          option={opt}
          mealId={meal.id}
          isSelected={opt.id === selectedOptionId}
          onSelect={() => handleSelectOption(opt.id)}
          onRemove={() => handleRemoveOption(opt.id,meal.id)}
          menuId={menuId}
          menuSource={menuSource}
        />
      ))}

      {/* Add option */}
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

      {/* Add option modal */}
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

              <Pressable onPress={() => setOptionModalOpen(false)}>
                <Text style={{ textAlign: "center", color: "#ef4444", fontWeight: "700" }}>
                  ביטול
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}


