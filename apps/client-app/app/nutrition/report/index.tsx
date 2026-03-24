import { useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { StatusView } from "@/components/ui/StatusView";
import { ProductPickerModal } from "@/components/nutrition/ProductPickerModal";
import { CoachHelpFallback } from "@/components/shared/CoachHelpFallback";
import { useNutritionDayPlan } from "@/hooks/nutrition/useNutritionDayPlan";
import {
  getDefaultMealSelection,
  useNutritionMutations
} from "@/hooks/nutrition/useNutritionMutations";
import type { NutritionDayType } from "@/types/nutrition/nutrition.ui";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type MealSelection = { productId: string; grams: number };

export default function ReportMealScreen() {
  const params = useLocalSearchParams<{ dayType?: string | string[] }>();
  const dayTypeParam = Array.isArray(params.dayType) ? params.dayType[0] : params.dayType;
  const dayType = (dayTypeParam as NutritionDayType) || "training";

  const { plan, isLoading, isError, refetch } = useNutritionDayPlan(dayType);
  const { reportMeal, isReportingMeal, error } = useNutritionMutations();

  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectionByMealId, setSelectionByMealId] = useState<Record<string, MealSelection>>(
    {}
  );
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!plan || plan.meals.length === 0) {
      return;
    }

    if (!selectedMealId) {
      const firstUnlogged = plan.meals.find((meal) => !meal.logged) ?? plan.meals[0];
      setSelectedMealId(firstUnlogged.id);
    }

    setSelectionByMealId((prev) => {
      const next = { ...prev };
      plan.meals.forEach((meal) => {
        if (!next[meal.id]) {
          next[meal.id] = getDefaultMealSelection(meal);
        }
      });
      return next;
    });
  }, [plan, selectedMealId]);

  const selectedMeal = useMemo(
    () => plan?.meals.find((meal) => meal.id === selectedMealId) ?? null,
    [plan, selectedMealId]
  );

  if (isLoading) {
    return (
      <Screen>
        <StatusView type="loading" title="טוען מסך דיווח ארוחה" />
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

  if (!plan || !selectedMeal) {
    return (
      <Screen>
        <StatusView type="empty" title="אין ארוחות לדיווח" />
      </Screen>
    );
  }

  const selection =
    selectionByMealId[selectedMeal.id] ?? getDefaultMealSelection(selectedMeal);
  const selectedProduct =
    selectedMeal.options.find((product) => product.id === selection.productId) ??
    selectedMeal.options[0];

  return (
    <Screen>
      <SectionHeader title="דיווח ארוחה" actionLabel="סגור" onActionPress={() => router.back()} />

      <NeonCard>
        <View style={styles.mealsSwitch}>
          {plan.meals.map((meal) => (
            <Pressable
              key={meal.id}
              onPress={() => setSelectedMealId(meal.id)}
              style={[
                styles.mealChip,
                selectedMeal.id === meal.id && styles.mealChipActive
              ]}
            >
              <Text
                style={[
                  styles.mealChipLabel,
                  selectedMeal.id === meal.id && styles.mealChipLabelActive
                ]}
              >
                {meal.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </NeonCard>

      <NeonCard>
        <View style={styles.details}>
          <Text style={styles.label}>מוצר</Text>
          <Text style={styles.value}>{selectedProduct?.name ?? "לא נבחר"}</Text>
          <Text style={styles.label}>כמות</Text>
          <Text style={styles.value}>{selection.grams} גרם</Text>
          <NeonButton label="בחירה מהתפריט" variant="secondary" onPress={() => setPickerOpen(true)} />
        </View>
      </NeonCard>

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
            mealId: selectedMeal.id,
            productId,
            grams: selection.grams
          });

          setSuccess("דיווח הארוחה נקלט בהצלחה");
        }}
      />

      {success ? <Text style={styles.success}>{success}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ProductPickerModal
        visible={pickerOpen}
        mealName={selectedMeal.name}
        products={selectedMeal.options}
        selectedProductId={selection.productId || selectedProduct?.id || ""}
        grams={selection.grams}
        onSelectProduct={(productId) =>
          setSelectionByMealId((prev) => ({
            ...prev,
            [selectedMeal.id]: {
              ...selection,
              productId
            }
          }))
        }
        onChangeGrams={(grams) =>
          setSelectionByMealId((prev) => ({
            ...prev,
            [selectedMeal.id]: {
              ...selection,
              grams
            }
          }))
        }
        onClose={() => setPickerOpen(false)}
        onConfirm={() => setPickerOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  mealsSwitch: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  mealChip: {
    paddingHorizontal: spacing.sm,
    minHeight: 36,
    borderRadius: 999,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surfaceElevated,
    justifyContent: "center"
  },
  mealChipActive: {
    backgroundColor: colors.neon,
    borderColor: colors.neon
  },
  mealChipLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600"
  },
  mealChipLabelActive: {
    color: colors.black,
    fontWeight: "700"
  },
  details: {
    gap: spacing.xs
  },
  label: {
    color: colors.textMuted,
    textAlign: "right",
    fontSize: 12
  },
  value: {
    color: colors.white,
    textAlign: "right",
    fontSize: 15,
    fontWeight: "700"
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
