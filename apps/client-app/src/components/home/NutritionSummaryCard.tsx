import { StyleSheet, Text, View } from "react-native";
import { NeonCard } from "@/components/ui/NeonCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { HomeSnapshot } from "@/types/home/home.ui";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type NutritionSummaryCardProps = {
  data: HomeSnapshot;
};

const macroRows: Array<keyof HomeSnapshot["macros"]> = ["protein", "carbs", "fat"];
const macroLabelMap = {
  protein: "חלבון",
  carbs: "פחמימות",
  fat: "שומן"
} satisfies Record<keyof HomeSnapshot["macros"], string>;

export function NutritionSummaryCard({ data }: NutritionSummaryCardProps) {
  return (
    <NeonCard>
      <View style={styles.container}>
        <Text style={styles.title}>סיכום תזונה</Text>
        <Text style={styles.calories}>{data.caloriesLabel}</Text>

        {macroRows.map((macroKey) => {
          const macro = data.macros[macroKey];
          return (
            <View key={macroKey} style={styles.macroRow}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>{macroLabelMap[macroKey]}</Text>
                <Text style={styles.macroValue}>
                  {macro.consumed}/{macro.target} גרם
                </Text>
              </View>
              <ProgressBar
                progress={macro.progress}
                color={macroKey === "protein" ? colors.info : macroKey === "carbs" ? colors.neon : colors.warning}
              />
            </View>
          );
        })}
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
  macroRow: {
    gap: spacing.xs
  },
  macroHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between"
  },
  macroLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600"
  },
  macroValue: {
    color: colors.textMuted,
    fontSize: 12
  }
});
