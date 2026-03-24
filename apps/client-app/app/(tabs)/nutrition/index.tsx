import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusView } from "@/components/ui/StatusView";
import { CoachHelpFallback } from "@/components/shared/CoachHelpFallback";
import { DayTypeTabs } from "@/components/nutrition/DayTypeTabs";
import { CaloriesProgressCard } from "@/components/nutrition/CaloriesProgressCard";
import { MealCard } from "@/components/nutrition/MealCard";
import { ProductPickerModal } from "@/components/nutrition/ProductPickerModal";
import { NeonButton } from "@/components/ui/NeonButton";
import { colors } from "@/constants/colors";
import { useNutritionDayPlan } from "@/hooks/nutrition/useNutritionDayPlan";
import {
  getDefaultMealSelection,
  useNutritionMutations
} from "@/hooks/nutrition/useNutritionMutations";
import type { NutritionDayType } from "@/types/nutrition/nutrition.ui";

type MealSelection = { productId: string; grams: number };

export default function NutritionScreen() {
  const [dayType, setDayType] = useState<NutritionDayType>("training");
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [pickerMealId, setPickerMealId] = useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);
  const [selectionByMealId, setSelectionByMealId] = useState<Record<string, MealSelection>>(
    {}
  );

  const { plan, isLoading, isError, refetch } = useNutritionDayPlan(dayType);
  const {
    setDayType: setDayTypeMutation,
    reportMeal,
    isSettingDayType,
    isReportingMeal,
    error
  } = useNutritionMutations();

  useEffect(() => {
    if (!plan) {
      return;
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

    if (!expandedMealId && plan.meals[0]) {
      setExpandedMealId(plan.meals[0].id);
    }
  }, [plan, expandedMealId]);

  const pickerMeal = useMemo(
    () => plan?.meals.find((meal) => meal.id === pickerMealId) ?? null,
    [plan, pickerMealId]
  );

  const pickerSelection = pickerMeal
    ? selectionByMealId[pickerMeal.id] ?? getDefaultMealSelection(pickerMeal)
    : null;

  if (isLoading) {
    return (
      <Screen>
        <StatusView type="loading" title="טוען תוכנית תזונה" />
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

  if (!plan) {
    return (
      <Screen>
        <StatusView
          type="empty"
          title="אין תוכנית תזונה זמינה"
          message="פנה למאמן כדי לקבל תפריט מעודכן"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="תזונה" />

      <DayTypeTabs
        value={dayType}
        disabled={isSettingDayType}
        onChange={async (next) => {
          setDayType(next);
          await setDayTypeMutation({ dayType: next });
        }}
      />

      <CaloriesProgressCard plan={plan} />

      <SectionHeader
        title="ארוחות היום"
        actionLabel="דווח ארוחה"
        onActionPress={() => router.push({ pathname: "/nutrition/report", params: { dayType } })}
      />

      {plan.meals.map((meal) => {
        const selection = selectionByMealId[meal.id] ?? getDefaultMealSelection(meal);
        const selectedProduct = meal.options.find(
          (product) => product.id === selection.productId
        );

        return (
          <MealCard
            key={meal.id}
            meal={meal}
            expanded={expandedMealId === meal.id}
            selectedProductName={selectedProduct?.name ?? "בחר מוצר"}
            selectedGrams={selection.grams}
            isReporting={isReportingMeal}
            onToggle={() =>
              setExpandedMealId((prev) => (prev === meal.id ? null : meal.id))
            }
            onOpenPicker={() => setPickerMealId(meal.id)}
            onOpenDetails={() =>
              router.push({
                pathname: `/nutrition/meal/${meal.id}`,
                params: { dayType }
              })
            }
            onReport={async () => {
              await reportMeal({
                dayType,
                mealId: meal.id,
                productId: selection.productId,
                grams: selection.grams
              });
              setLastSuccess(`הארוחה '${meal.name}' דווחה בהצלחה`);
            }}
          />
        );
      })}

      {lastSuccess ? <Text style={styles.success}>{lastSuccess}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <NeonButton
        label="דווח ארוחה"
        onPress={() => router.push({ pathname: "/nutrition/report", params: { dayType } })}
      />

      {pickerMeal && pickerSelection ? (
        <ProductPickerModal
          visible={Boolean(pickerMealId)}
          mealName={pickerMeal.name}
          products={pickerMeal.options}
          selectedProductId={pickerSelection.productId}
          grams={pickerSelection.grams}
          onSelectProduct={(productId) =>
            setSelectionByMealId((prev) => ({
              ...prev,
              [pickerMeal.id]: {
                ...pickerSelection,
                productId
              }
            }))
          }
          onChangeGrams={(grams) =>
            setSelectionByMealId((prev) => ({
              ...prev,
              [pickerMeal.id]: {
                ...pickerSelection,
                grams
              }
            }))
          }
          onClose={() => setPickerMealId(null)}
          onConfirm={() => setPickerMealId(null)}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
