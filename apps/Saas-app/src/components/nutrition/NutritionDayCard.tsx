import { View, Text, Pressable, Modal, TextInput } from "react-native";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import NutritionNotes from "./NutritionNotes";
import NutritionSupplements from "./NutritionSupplements";
import MealBlock from "./MealBlock";
import { UINutritionPlan } from "../../types/ui/nutrition-ui";
import { useUpdateTemplateMenu } from "../../hooks/nutrition/useUpdateTemplateMenu";

type Props = {
  plan: UINutritionPlan;
};

export default function NutritionDayCard({ plan }: Props) {
  if (!plan) return null;

  const queryClient = useQueryClient();
  const isTraining = plan.dayType === "TRAINING";
  const updateMenu = useUpdateTemplateMenu(plan.id);
  const [addMealOpen, setAddMealOpen] = useState(false);
  const [newMealName, setNewMealName] = useState("");

  const totalCalories = useMemo(
    () => plan.meals.reduce((sum, meal) => sum + (meal.totalCalories ?? 0), 0),
    [plan.meals]
  );


  const handleAddMeal = () => {
    const trimmedName = newMealName.trim();
    if (!trimmedName) return;

    updateMenu.mutate(
      {
        mealsToAdd: [
          {
            name: trimmedName,
            totalCalories: 0,
          },
        ],
      },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(["templateMenu", plan.id], data);
          setNewMealName("");
          setAddMealOpen(false);
        },
      }
    );
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          borderBottomWidth: 1,
          paddingBottom: 12,
          borderBottomColor: "#f1f5f9",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700" }}>
          {isTraining ? "תפריט יום אימון" : "תפריט יום ללא אימון"}
        </Text>

        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Pressable
            onPress={() => setAddMealOpen(true)}
            style={{
              backgroundColor: "#eef2ff",
              borderColor: "#c7d2fe",
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#4338ca", fontWeight: "700" }}>
              הוסף ארוחה
            </Text>
          </Pressable>
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#f8fafc",
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: "#e2e8f0",
            }}
          >
            <Text style={{ fontSize: 14 }}>סה״כ קלוריות:</Text>
            <Text
              style={{
                minWidth: 70,
                textAlign: "center",
                borderRadius: 8,
                paddingVertical: 4,
                paddingHorizontal: 6,
                fontWeight: "600",
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#d1d5db",
              }}
            >
              {totalCalories}
            </Text>
            <Text style={{ fontWeight: "600" }}>קק״ל</Text>
          </View>
        </View>
      </View>

      <NutritionNotes notes={plan.notes} templateMenuId={plan.id} />

      <NutritionSupplements
        vitamins={plan.vitamins}
        templateMenuId={plan.id}
        />

          {plan.meals.map((meal) => (
          <MealBlock key={meal.id} meal={meal} templateMenuId={plan.id} />
        ))}
        {addMealOpen && (
          <Modal transparent animationType="fade" visible={addMealOpen}>
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
                  שם הארוחה
                </Text>

                <Pressable onPress={() => setAddMealOpen(false)}>
                  <Text style={{ color: "#ef4444", fontWeight: "700" }}>
                    סגור
                  </Text>
                </Pressable>
              </View>

              <TextInput
                placeholder="לדוגמה: ארוחת צהריים"
                value={newMealName}
                onChangeText={setNewMealName}
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
                onPress={handleAddMeal}
                style={{
                  backgroundColor: "#22c55e",
                  paddingVertical: 12,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "white", fontWeight: "700", textAlign: "center" }}>
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