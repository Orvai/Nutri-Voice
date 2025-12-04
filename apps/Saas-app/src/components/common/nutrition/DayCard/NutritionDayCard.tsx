import { View, Text } from "react-native";
import NutritionNotes from "../Notes/NutritionNotes";
import { SupplementsList } from "../Supplements";
import MealBlock from "../Meals/MealBlock";
import { NutritionPlan, Supplement } from "../../../../types/nutrition";

interface Props {
  plan: NutritionPlan;

  // Supplements handlers
  onAddSupplement: (data: { name: string; dosage?: string; timing?: string }) => void;
  onRemoveSupplement: (id: string) => void;
  onUpdateSupplement: (id: string, fields: Partial<Supplement>) => void;

  // Meals / Items handlers (will connect later)
  onRemoveMeal?: (mealId: string) => void;
  onAddMeal?: () => void;
  onAddFoodItem?: (mealId: string, optionId: string) => void;
  onRemoveFoodItem?: (mealId: string, optionId: string, foodItemId: string) => void;
  onUpdateFoodItem?: (
    mealId: string,
    optionId: string,
    foodItemId: string,
    fields: any
  ) => void;
}

export default function NutritionDayCard({
  plan,
  onAddSupplement,
  onRemoveSupplement,
  onUpdateSupplement,
  onAddMeal,
  onRemoveMeal,
  onAddFoodItem,
  onRemoveFoodItem,
  onUpdateFoodItem,
}: Props) {
  if (!plan) return null;

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 20,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700" }}>{plan.name}</Text>
        <Text style={{ fontSize: 16, color: "#6b7280" }}>
          {plan.totalCalories} kcal
        </Text>
      </View>

      {/* Notes */}
      <NutritionNotes notes={plan.notes} />

      {/* Supplements */}
      <SupplementsList
        supplements={plan.supplements}
        onAdd={onAddSupplement}
        onRemove={onRemoveSupplement}
        onUpdate={onUpdateSupplement}
      />

      {/* Meals */}
      {plan.meals.map((meal) => (
        <MealBlock
          key={meal.id}
          meal={meal}
          onRemoveMeal={onRemoveMeal}
          onAddFoodItem={onAddFoodItem}
          onRemoveFoodItem={onRemoveFoodItem}
          onUpdateFoodItem={onUpdateFoodItem}
        />
      ))}
    </View>
  );
}
