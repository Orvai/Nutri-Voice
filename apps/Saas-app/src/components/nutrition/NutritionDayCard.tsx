import { View, Text, TextInput } from "react-native";
import NutritionNotes from "./NutritionNotes";
import NutritionSupplements from "./NutritionSupplements";
import MealBlock from "./MealBlock";
import { UINutritionPlan } from "../../types/nutrition-ui";

type Props = {
  plan: UINutritionPlan;
};

export default function NutritionDayCard({ plan }: Props) {
  if (!plan) return null;

  const isTraining = plan.dayType === "TRAINING";

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
          <TextInput
            style={{
              width: 70,
              borderWidth: 1,
              borderColor: "#d1d5db",
              textAlign: "center",
              borderRadius: 8,
              paddingVertical: 4,
            }}
            keyboardType="numeric"
            defaultValue={plan.totalCalories.toString()}
          />
          <Text style={{ fontWeight: "600" }}>קק״ל</Text>
        </View>
      </View>

      <NutritionNotes notes={plan.notes} />

      <NutritionSupplements vitamins={plan.vitamins} />

      {plan.meals.map((meal) => (
        <MealBlock key={meal.id} meal={meal} />
      ))}
    </View>
  );
}
