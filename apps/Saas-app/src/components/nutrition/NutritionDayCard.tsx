import { View, Text, Pressable, Modal, TextInput } from "react-native";
import { useEffect, useMemo, useState } from "react";
import NutritionNotes from "./NutritionNotes";
import NutritionSupplements from "./NutritionSupplements";
import MealBlock from "./MealBlock";
import { UINutritionPlan } from "../../types/ui/nutrition/nutrition.types";
import { useNutritionMenuMutation } from "@/hooks/composition/useNutritionMenuMutation";
import { styles } from "./styles/NutritionDayCard.styles";

type Props = {
  plan: UINutritionPlan;
  onAllowedDaysPerWeekChange?: (menuId: string, allowedDaysPerWeek: number) => void;
};

function clampAllowedDaysPerWeek(value: number): number {
  if (Number.isNaN(value)) return 7;
  if (value < 0) return 0;
  if (value > 7) return 7;
  return Math.round(value);
}

function parseAllowedDaysInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  if (Number.isNaN(parsed)) return null;
  return clampAllowedDaysPerWeek(parsed);
}

export default function NutritionDayCard({
  plan,
  onAllowedDaysPerWeekChange,
}: Props) {
  if (!plan) return null;

  const isTraining = plan.dayType === "TRAINING";
  const isClientMenu = plan.source === "client";

  //  New semantic facade (no DTO leakage, no react-query in UI)
  const menuActions = useNutritionMenuMutation(plan.source);

  const [addMealOpen, setAddMealOpen] = useState(false);
  const [newMealName, setNewMealName] = useState("");

  const totalCalories = plan.totalCalories ?? 0;
  const savedAllowedDaysPerWeek = clampAllowedDaysPerWeek(
    plan.allowedDaysPerWeek ?? 7
  );
  const [allowedDaysInput, setAllowedDaysInput] = useState(
    String(savedAllowedDaysPerWeek)
  );

  useEffect(() => {
    setAllowedDaysInput(String(savedAllowedDaysPerWeek));
  }, [savedAllowedDaysPerWeek]);

  const draftAllowedDaysPerWeek = useMemo(() => {
    const parsed = parseAllowedDaysInput(allowedDaysInput);
    return parsed ?? savedAllowedDaysPerWeek;
  }, [allowedDaysInput, savedAllowedDaysPerWeek]);

  const handleAddMeal = () => {
    const trimmedName = newMealName.trim();
    if (!trimmedName) return;

    menuActions.addMeal(plan.id, { name: trimmedName });

    setNewMealName("");
    setAddMealOpen(false);
  };

  const commitAllowedDays = () => {
    if (!isClientMenu) return;

    const parsed = parseAllowedDaysInput(allowedDaysInput);
    const nextAllowedDays = parsed ?? savedAllowedDaysPerWeek;
    setAllowedDaysInput(String(nextAllowedDays));

    if (
      nextAllowedDays !== savedAllowedDaysPerWeek &&
      onAllowedDaysPerWeekChange
    ) {
      onAllowedDaysPerWeekChange(plan.id, nextAllowedDays);
    }
  };

  const shiftAllowedDays = (delta: number) => {
    if (!isClientMenu) return;
    const nextAllowedDays = clampAllowedDaysPerWeek(
      draftAllowedDaysPerWeek + delta
    );
    setAllowedDaysInput(String(nextAllowedDays));
    if (
      nextAllowedDays !== savedAllowedDaysPerWeek &&
      onAllowedDaysPerWeekChange
    ) {
      onAllowedDaysPerWeekChange(plan.id, nextAllowedDays);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Text style={styles.title}>
            {isTraining ? "יום העמסה" : "יום ללא העמסה"}
          </Text>

          <View style={styles.row}>
            <Pressable
              onPress={() => setAddMealOpen(true)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>הוסף ארוחה</Text>
            </Pressable>

            <View style={styles.caloriesContainer}>
              <Text style={styles.caloriesLabel}>סה״כ קלוריות:</Text>
              <Text style={styles.caloriesValue}>
                {totalCalories}
              </Text>
              <Text style={styles.caloriesUnit}>קק״ל</Text>
            </View>
          </View>
        </View>

        {isClientMenu ? (
          <View style={styles.allowedDaysRow}>
            <Text style={styles.allowedDaysLabel}>ימים בשבוע לתפריט הזה:</Text>

            <View style={styles.allowedDaysControls}>
              <Pressable
                style={styles.adjustButton}
                onPress={() => shiftAllowedDays(-1)}
              >
                <Text style={styles.adjustButtonText}>-</Text>
              </Pressable>

              <TextInput
                value={allowedDaysInput}
                onChangeText={(text) =>
                  setAllowedDaysInput(text.replace(/[^\d]/g, ""))
                }
                onBlur={commitAllowedDays}
                keyboardType="number-pad"
                maxLength={1}
                style={styles.allowedDaysInput}
              />

              <Pressable
                style={styles.adjustButton}
                onPress={() => shiftAllowedDays(1)}
              >
                <Text style={styles.adjustButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>

      <NutritionNotes notes={plan.notes} menuId={plan.id} source={plan.source} />

      <NutritionSupplements
        vitamins={plan.vitamins}
        menuId={plan.id}
        source={plan.source}
      />

      {plan.meals.map((meal) => (
        <MealBlock
          key={meal.id}
          meal={meal}
          menuId={plan.id}
          menuSource={plan.source}
        />
      ))}

      {addMealOpen && (
        <Modal transparent animationType="fade" visible={addMealOpen}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  שם הארוחה
                </Text>

                <Pressable onPress={() => setAddMealOpen(false)}>
                  <Text style={styles.modalCloseText}>
                    סגור
                  </Text>
                </Pressable>
              </View>

              <TextInput
                placeholder="לדוגמה: ארוחת צהריים"
                value={newMealName}
                onChangeText={setNewMealName}
                style={styles.modalInput}
              />

              <Pressable
                onPress={handleAddMeal}
                style={styles.modalSubmitButton}
              >
                <Text style={styles.modalSubmitText}>
                  הוסף ארוחה
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
