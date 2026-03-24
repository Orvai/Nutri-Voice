import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NeonCard } from "@/components/ui/NeonCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type DailyMetricsGridProps = {
  waterLabel: string;
  stepsLabel: string;
};

export function DailyMetricsGrid({ waterLabel, stepsLabel }: DailyMetricsGridProps) {
  return (
    <View style={styles.grid}>
      <NeonCard style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Ionicons name="water-outline" size={18} color={colors.info} />
          <Text style={styles.metricTitle}>מים</Text>
        </View>
        <Text style={styles.metricValue}>{waterLabel}</Text>
        <ProgressBar progress={0.78} color={colors.info} />
      </NeonCard>

      <NeonCard style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Ionicons name="walk-outline" size={18} color={colors.neon} />
          <Text style={styles.metricTitle}>צעדים</Text>
        </View>
        <Text style={styles.metricValue}>{stepsLabel}</Text>
        <ProgressBar progress={0.84} color={colors.neon} />
      </NeonCard>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row-reverse",
    gap: spacing.sm
  },
  metricCard: {
    flex: 1,
    gap: spacing.sm
  },
  metricHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center"
  },
  metricTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600"
  },
  metricValue: {
    color: colors.white,
    fontSize: 22,
    textAlign: "right",
    fontWeight: "700"
  }
});
