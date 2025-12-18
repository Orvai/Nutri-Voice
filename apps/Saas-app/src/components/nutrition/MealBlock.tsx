// src/components/nutrition/MealBlock.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, Modal } from "react-native";

import MealOptionsBlock from "./MealOptionsBlock";

import { UIMeal, UINutritionSource } from "../../types/ui/nutrition/nutrition.types";
import { useNutritionMenuMutation } from "@/hooks/composition/useNutritionMenuMutation";
import { styles } from "./styles/MealBlock.styles";

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{meal.title}</Text>
          {meal.timeRange && (
            <Text style={styles.subtitle}>
              {meal.timeRange}
            </Text>
          )}
        </View>

        <View style={styles.row}>
          {/* Calories input (editable) */}
          <TextInput
            value={caloriesInput}
            onChangeText={setCaloriesInput}
            onBlur={handleCaloriesBlur}
            keyboardType="numeric"
            placeholder="קלוריות"
            style={styles.input}
          />

          {/* Remove meal */}
          <Pressable
            onPress={handleRemoveMeal}
            disabled={removing}
            style={styles.removeButton}
          >
            <Text style={[styles.removeText, removing && styles.removeTextDisabled]}>
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
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>
          הוסף אופציה
        </Text>
      </Pressable>

      {/* Add option modal */}
      {optionModalOpen && (
        <Modal transparent animationType="fade" visible>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                שם האופציה
              </Text>

              <TextInput
                value={newOptionName}
                onChangeText={setNewOptionName}
                placeholder="לדוגמה: אופציה 1"
                style={styles.modalInput}
              />

              <Pressable
                onPress={handleAddOption}
                style={styles.modalSubmitButton}
              >
                <Text style={styles.modalSubmitText}>
                  הוסף אופציה
                </Text>
              </Pressable>

              <Pressable onPress={() => setOptionModalOpen(false)}>
                <Text style={styles.modalCancelText}>
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


