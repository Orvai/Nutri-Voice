// src/components/analytics/StreaksTracker.tsx
import React, { memo } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles/StreaksTracker.styles";
import type { CoachAnalytics } from "@/types/ui/tracking/coach-analytics.ui";

type Props = {
  streaks: CoachAnalytics["streaks"];
};

const StreaksTracker = memo(({ streaks }: Props) => {
  const quality =
    streaks.nutritionStreak.quality === "חזק"
      ? styles.qStrong
      : streaks.nutritionStreak.quality === "בינוני"
      ? styles.qMid
      : styles.qWeak;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.sectionTitle}>מומנטום ועקביות</Text>
          <Text style={styles.sectionSub}>אמינות: {streaks.confidence}</Text>
        </View>

        <View style={[styles.qualityPill, quality]}>
          <Text style={styles.qualityText}>איכות: {streaks.nutritionStreak.quality}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🔥</Text>
          <View style={styles.textContainer}>
            <Text style={styles.label}>סטריק עמידה ביעד</Text>
            <View style={styles.valueRow}>
              <Text style={styles.currentValue}>{streaks.nutritionStreak.currentDays}</Text>
              <Text style={styles.maxValue}>/ {streaks.nutritionStreak.maxDays} שיא</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.emoji}>📝</Text>
          <View style={styles.textContainer}>
            <Text style={styles.label}>סטריק רישום</Text>
            <View style={styles.valueRow}>
              <Text style={styles.currentValue}>{streaks.loggingStreak.currentDays}</Text>
              <Text style={styles.maxValue}>/ {streaks.loggingStreak.maxDays} שיא</Text>
            </View>
            {typeof streaks.loggingStreak.completenessRate === "number" ? (
              <Text style={styles.note}>שלמות רישום: {Math.round(streaks.loggingStreak.completenessRate)}%</Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
});

export default StreaksTracker;
