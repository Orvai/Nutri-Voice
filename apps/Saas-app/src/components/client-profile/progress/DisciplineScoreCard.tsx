// src/components/analytics/DisciplineScoreCard.tsx
import React, { memo } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles/DisciplineScoreCard.styles";
import type { CoachAnalytics } from "@/types/ui/tracking/coach-analytics.ui";

type Props = {
  data: CoachAnalytics["discipline"];
};

const DisciplineScoreCard = memo(({ data }: Props) => {
  const severity =
    data.band === "מצוין" || data.band === "טוב"
      ? "success"
      : data.band === "בינוני"
      ? "warning"
      : "critical";

  const statusColor =
    severity === "success"
      ? styles.statusSuccess
      : severity === "warning"
      ? styles.statusWarning
      : styles.statusCritical;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>מדד עקביות</Text>
          <Text style={styles.subTitle}>
            אמינות: {data.confidence}
          </Text>
        </View>

        <View style={styles.bandPill}>
          <Text style={styles.bandText}>{data.band}</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{data.score}</Text>
          <Text style={styles.scorePercent}>%</Text>
        </View>

        <View style={styles.textDetails}>
          <Text style={[styles.statusText, statusColor]}>{data.statusText}</Text>

          {data.biggestLevers?.[0] ? (
            <Text style={styles.hintText}>
              פוקוס: {data.biggestLevers[0].label}
              {data.biggestLevers[0].hint ? ` • ${data.biggestLevers[0].hint}` : ""}
            </Text>
          ) : (
            <Text style={styles.hintText}>פוקוס: אין כרגע חסמים בולטים</Text>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metricsGrid}>
        <View style={styles.metricEntry}>
          <Text style={styles.metricLabel}>רישום</Text>
          <Text style={styles.metricValue}>{Math.round(data.breakdown.loggingRate)}%</Text>
        </View>

        <View style={styles.metricEntry}>
          <Text style={styles.metricLabel}>עמידה ביעד</Text>
          <Text style={styles.metricValue}>{Math.round(data.breakdown.adherenceRate)}%</Text>
        </View>

        {typeof data.breakdown.workoutConsistency === "number" ? (
          <View style={styles.metricEntry}>
            <Text style={styles.metricLabel}>עקביות אימונים</Text>
            <Text style={styles.metricValue}>{Math.round(data.breakdown.workoutConsistency)}%</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});

export default DisciplineScoreCard;
