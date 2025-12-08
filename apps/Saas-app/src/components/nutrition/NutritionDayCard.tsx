import { View, Text } from "react-native";
import NutritionNotes from "./NutritionNotes";
import NutritionSupplements from "./NutritionSupplements";
import MealBlock from "./MealBlock";
import { UINutritionPlan } from "../../types/ui/nutrition-ui";

type Props = {
  plan: UINutritionPlan;
};

export default function NutritionDayCard({ plan }: Props) {
  if (!plan) return null;

  const isTraining = plan.dayType === "TRAINING";
  const totalCalories = plan.meals.reduce(
    (sum, meal) => sum + (meal.totalCalories ?? 0),
    0
  );

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

        <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 14 }}>סה״כ קלוריות:</Text>
          <Text
            style={{
              minWidth: 70,
              borderWidth: 1,
              borderColor: "#d1d5db",
              textAlign: "center",
              borderRadius: 8,
              paddingVertical: 6,
              fontWeight: "600",
            }}
          >
            {totalCalories}
          </Text>
          <Text style={{ fontWeight: "600" }}>קק״ל</Text>
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
    </View>
  );
}
