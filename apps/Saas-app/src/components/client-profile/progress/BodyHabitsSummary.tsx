// src/components/analytics/BodyHabitsSummary.tsx
import React, { memo } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles/BodyHabitsSummary.styles";
import type { CoachAnalytics, GoalType } from "@/types/ui/tracking/coach-analytics.ui";

type Props = {
  body: CoachAnalytics["body"];
};

function weightColor(goal: GoalType, changeKg: number) {
  if (goal === "CUT") {
    if (changeKg <= -0.2) return styles.good;
    if (changeKg >= 0.2) return styles.bad;
    return styles.neutral;
  }

  if (goal === "BULK") {
    if (changeKg >= 0.2) return styles.good;
    if (changeKg <= -0.2) return styles.bad;
    return styles.neutral;
  }

  if (goal === "MAINTAIN") {
    if (Math.abs(changeKg) <= 0.3) return styles.good;
    if (Math.abs(changeKg) <= 0.7) return styles.neutral;
    return styles.bad;
  }

  return styles.neutral;
}

function goalLabel(goal: GoalType) {
  switch (goal) {
    case "CUT":
      return "חיטוב";
    case "BULK":
      return "מסה";
    case "MAINTAIN":
      return "שימור";
    default:
      return "לא מוגדר";
  }
}

const BodyHabitsSummary = memo(({ body }: Props) => {
  const stepsAvg = body.steps.avg ?? 0;
  const sleepAvg = body.sleep.avgHours ?? 0;
  const changeKg = body.weight.changeKg ?? 0;

  const weightStyle = weightColor(body.goal, changeKg);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.sectionTitle}>גוף והרגלים</Text>
          <Text style={styles.sectionSub}>
            יעד: {goalLabel(body.goal)} • אמינות: {body.confidence}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>ממוצע צעדים</Text>
            <Text style={styles.gridValue}>{Number(stepsAvg).toLocaleString()}</Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>ממוצע שינה</Text>
            <Text style={styles.gridValue}>{sleepAvg ? `${sleepAvg.toFixed(1)}h` : "—"}</Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>שינוי משקל</Text>
            <Text style={[styles.gridValue, weightStyle]}>
              {changeKg > 0 ? "+" : ""}
              {changeKg.toFixed(2)} ק״ג
            </Text>
            <Text style={styles.smallNote}>{body.weight.statusText}</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default BodyHabitsSummary;
