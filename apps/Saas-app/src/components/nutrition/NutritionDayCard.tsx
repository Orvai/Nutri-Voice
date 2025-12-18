import { View, Text, Pressable, Modal, TextInput } from "react-native";
import { useMemo, useState } from "react";
import NutritionNotes from "./NutritionNotes";
import NutritionSupplements from "./NutritionSupplements";
import MealBlock from "./MealBlock";
import { UINutritionPlan } from "../../types/ui/nutrition/nutrition.types";
import { useNutritionMenuMutation } from "@/hooks/composition/useNutritionMenuMutation";
import { styles } from "./styles/NutritionDayCard.styles";

type Props = {
  plan: UINutritionPlan;
};

export default function NutritionDayCard({ plan }: Props) {
  if (!plan) return null;

  const isTraining = plan.dayType === "TRAINING";

  //  New semantic facade (no DTO leakage, no react-query in UI)
  const menuActions = useNutritionMenuMutation(plan.source);

  const [addMealOpen, setAddMealOpen] = useState(false);
  const [newMealName, setNewMealName] = useState("");

  const totalCalories = plan.totalCalories ?? 0;

  const handleAddMeal = () => {
    const trimmedName = newMealName.trim();
    if (!trimmedName) return;

    menuActions.addMeal(plan.id, { name: trimmedName });

    setNewMealName("");
    setAddMealOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isTraining ? "תפריט יום אימון" : "תפריט יום ללא אימון"}
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