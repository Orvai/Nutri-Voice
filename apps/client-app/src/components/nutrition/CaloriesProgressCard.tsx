import { StyleSheet, Text, View } from "react-native";
import { NeonCard } from "@/components/ui/NeonCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { NutritionDayPlan } from "@/types/nutrition/nutrition.ui";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type CaloriesProgressCardProps = {
  plan: NutritionDayPlan;
};

export function CaloriesProgressCard({ plan }: CaloriesProgressCardProps) {
  return (
    <NeonCard>
      <View style={styles.container}>
        <Text style={styles.title}>{plan.title}</Text>
        <Text style={styles.calories}>
          {plan.consumedCalories}/{plan.calorieTarget} קל׳
        </Text>
        <ProgressBar progress={plan.caloriesProgress} color={colors.neon} height={8} />
        <Text style={styles.remaining}>נותרו {plan.remainingCalories} קלוריות</Text>

        <View style={styles.macros}>
          <Text style={styles.macro}>חלבון {plan.macros.protein.consumed}/{plan.macros.protein.target}</Text>
          <Text style={styles.macro}>פחמימות {plan.macros.carbs.consumed}/{plan.macros.carbs.target}</Text>
          <Text style={styles.macro}>שומן {plan.macros.fat.consumed}/{plan.macros.fat.target}</Text>
        </View>
      </View>
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right"
  },
  calories: {
    color: colors.neon,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right"
  },
  remaining: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "right"
  },
  macros: {
    gap: spacing.xs
  },
  macro: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "right"
  }
});
