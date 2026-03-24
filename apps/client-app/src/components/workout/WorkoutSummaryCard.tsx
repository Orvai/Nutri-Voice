import { StyleSheet, Text, View } from "react-native";
import type { WorkoutSummary } from "@/types/workout/workout.ui";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type WorkoutSummaryCardProps = {
  summary: WorkoutSummary;
  onBackHome: () => void;
  onNextAction: () => void;
};

export function WorkoutSummaryCard({
  summary,
  onBackHome,
  onNextAction
}: WorkoutSummaryCardProps) {
  return (
    <NeonCard>
      <View style={styles.container}>
        <Text style={styles.title}>האימון הושלם</Text>
        <Text style={styles.meta}>סיום: {summary.completedAtLabel}</Text>

        <View style={styles.stats}>
          <Text style={styles.stat}>סטים שבוצעו: {summary.totalSetsCompleted}</Text>
          <Text style={styles.stat}>נפח כולל: {summary.totalVolumeKg} ק״ג</Text>
          <Text style={styles.stat}>משך: {summary.durationMinutes} דקות</Text>
          <Text style={styles.stat}>תחושת מאמץ: {summary.effortLabel}</Text>
        </View>

        <Text style={styles.next}>{summary.nextBestActionLabel}</Text>

        <View style={styles.actions}>
          <NeonButton label="חזרה לבית" onPress={onBackHome} variant="secondary" />
          <NeonButton label="המשך לצעד הבא" onPress={onNextAction} />
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
    fontSize: 24,
    fontWeight: "800",
    textAlign: "right"
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "right"
  },
  stats: {
    gap: spacing.xs,
    marginTop: spacing.xs
  },
  stat: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "right"
  },
  next: {
    color: colors.neon,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right"
  },
  actions: {
    gap: spacing.xs,
    marginTop: spacing.sm
  }
});
