// src/components/analytics/NutritionPeriodReport.tsx
import React, { memo } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles/NutritionPeriodReport.styles";
import type { CoachAnalytics } from "@/types/ui/tracking/coach-analytics.ui";

type Props = {
  nutrition: CoachAnalytics["nutrition"];
};

const MacroTag = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagLabel}>{label}</Text>
      <Text style={styles.tagValue}>{Math.round(value)}g</Text>
    </View>
  );
};

const NutritionPeriodReport = memo(({ nutrition }: Props) => {
  const avg = nutrition.dailyAverages;

  const calStd = nutrition.variability.caloriesKcal?.std ?? 0;
  const calStdText =
    calStd > 0 ? `תנודתיות קלוריות (סטיית תקן): ±${Math.round(calStd)} kcal` : "תנודתיות קלוריות: אין מספיק נתונים";

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.sectionTitle}>סיכום תזונה לתקופה</Text>
          <Text style={styles.sectionSub}>אמינות: {nutrition.confidence}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.calorieSection}>
          <Text style={styles.avgLabel}>קלוריות ממוצע ליום</Text>
          <Text style={styles.avgValue}>{Math.round(avg.caloriesKcal).toLocaleString()}</Text>
          <Text style={styles.unit}>kcal / day</Text>
          <Text style={styles.variabilityText}>{calStdText}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.macroGrid}>
          <MacroTag label="חלבון" value={avg.proteinG} />
          <MacroTag label="פחמימות" value={avg.carbsG} />
          <MacroTag label="שומן" value={avg.fatG} />
        </View>
      </View>
    </View>
  );
});

export default NutritionPeriodReport;
