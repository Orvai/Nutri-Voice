// src/components/analytics/StrengthProgressionList.tsx
import React, { memo } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles/StrengthProgressionList.styles";
import type { CoachAnalytics } from "@/types/ui/tracking/coach-analytics.ui";

type Props = {
  exercises: CoachAnalytics["strength"]["exercises"];
  confidence?: CoachAnalytics["strength"]["confidence"];
};

const StrengthProgressionList = memo(({ exercises, confidence }: Props) => {
  const safe = exercises ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>כוח והתקדמות</Text>
        {confidence ? <Text style={styles.sectionSub}>אמינות: {confidence}</Text> : null}
      </View>

      <View style={styles.list}>
        {safe.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>אין מספיק נתוני כוח לתקופה שנבחרה.</Text>
          </View>
        ) : (
          safe.map((ex, idx) => {
            const positive = ex.improvementKg >= 0;

            return (
              <View key={`${ex.name}-${idx}`} style={styles.exerciseCard}>
                <View style={styles.headerRowCard}>
                  <Text style={styles.exerciseName}>{ex.name}</Text>

                  <View style={[styles.badge, positive ? styles.positiveBadge : styles.negativeBadge]}>
                    <Text style={styles.badgeText}>
                      {positive ? "+" : ""}
                      {ex.improvementKg} ק״ג
                    </Text>
                  </View>
                </View>

                <Text style={styles.statusText}>{ex.statusText}</Text>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>שיא בתקופה</Text>
                    <Text style={styles.statValue}>{ex.maxWeightKg ?? "—"} ק״ג</Text>
                  </View>

                  <View style={styles.verticalDivider} />

                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>תדירות</Text>
                    <Text style={styles.statValue}>
                      {ex.frequencyPerWeek != null ? `${ex.frequencyPerWeek}/שבוע` : `${ex.frequency}x`}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
});

export default StrengthProgressionList;
