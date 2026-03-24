import { useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusView } from "@/components/ui/StatusView";
import { CoachHelpFallback } from "@/components/shared/CoachHelpFallback";
import { ProductPickerModal } from "@/components/nutrition/ProductPickerModal";
import { useNutritionDayPlan } from "@/hooks/nutrition/useNutritionDayPlan";
import {
  getDefaultMealSelection,
  useNutritionMutations
} from "@/hooks/nutrition/useNutritionMutations";
import type { NutritionDayType } from "@/types/nutrition/nutrition.ui";
import { colors } from "@/constants/colors";

export default function MealDetailsScreen() {
  const params = useLocalSearchParams<{ mealId?: string | string[]; dayType?: string | string[] }>();
  const mealId = Array.isArray(params.mealId) ? params.mealId[0] : params.mealId;
  const dayTypeParam = Array.isArray(params.dayType) ? params.dayType[0] : params.dayType;
  const dayType = (dayTypeParam as NutritionDayType) || "training";

  const { plan, isLoading, isError, refetch } = useNutritionDayPlan(dayType);
  const { reportMeal, isReportingMeal, error } = useNutritionMutations();

  const meal = useMemo(
    () => plan?.meals.find((candidate) => candidate.id === mealId) ?? null,
    [plan, mealId]
  );

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selection, setSelection] = useState(() =>
    meal ? getDefaultMealSelection(meal) : { productId: "", grams: 150 }
  );
  const [success, setSuccess] = useState<string | null>(null);

  if (!mealId) {
    return (
      <Screen>
        <StatusView type="error" title="מזהה ארוחה חסר" />
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen>
        <StatusView type="loading" title="טוען פרטי ארוחה" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <CoachHelpFallback onRetry={() => void refetch()} />
      </Screen>
    );
  }

  if (!meal) {
    return (
      <Screen>
        <StatusView type="empty" title="הארוחה לא נמצאה" />
      </Screen>
    );
  }

  const selectedProduct = meal.options.find((item) => item.id === selection.productId) ?? meal.options[0];

  return (
    <Screen>
      <SectionHeader title={meal.name} actionLabel="חזור" onActionPress={() => router.back()} />

      <NeonCard>
        <View style={styles.cardCopy}>
          <Text style={styles.target}>יעד: {meal.targetCalories} קל׳</Text>
          <Text style={styles.current}>מוצר נבחר: {selectedProduct?.name ?? "לא נבחר"}</Text>
          <Text style={styles.current}>כמות: {selection.grams} גרם</Text>
        </View>
      </NeonCard>

      <NeonButton label="בחר מוצר וכמות" onPress={() => setPickerOpen(true)} variant="secondary" />
      <NeonButton
        label="דווח ארוחה"
        loading={isReportingMeal}
        onPress={async () => {
          const productId = selection.productId || selectedProduct?.id;
          if (!productId) {
            return;
          }

          await reportMeal({
            dayType,
            mealId: meal.id,
            productId,
            grams: selection.grams
          });

          setSuccess("הארוחה דווחה בהצלחה");
        }}
      />

      {success ? <Text style={styles.success}>{success}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ProductPickerModal
        visible={pickerOpen}
        mealName={meal.name}
        products={meal.options}
        selectedProductId={selection.productId || selectedProduct?.id || ""}
        grams={selection.grams}
        onSelectProduct={(productId) => setSelection((prev) => ({ ...prev, productId }))}
        onChangeGrams={(grams) => setSelection((prev) => ({ ...prev, grams }))}
        onClose={() => setPickerOpen(false)}
        onConfirm={() => setPickerOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardCopy: {
    gap: 6
  },
  target: {
    color: colors.neon,
    textAlign: "right",
    fontWeight: "700",
    fontSize: 14
  },
  current: {
    color: colors.textSecondary,
    textAlign: "right",
    fontSize: 13
  },
  success: {
    color: colors.success,
    textAlign: "right",
    fontSize: 13
  },
  error: {
    color: colors.danger,
    textAlign: "right",
    fontSize: 13
  }
});
