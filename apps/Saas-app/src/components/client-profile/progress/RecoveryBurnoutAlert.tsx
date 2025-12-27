// src/components/analytics/RecoveryBurnoutAlert.tsx
import React, { memo } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles/RecoveryBurnoutAlert.styles";
import type { CoachAnalytics, EffortLevel, Severity } from "@/types/ui/tracking/coach-analytics.ui";

type Props = {
  recovery: CoachAnalytics["recovery"];
};

function severityStyle(sev: Severity) {
  switch (sev) {
    case "success":
      return styles.sevSuccess;
    case "warning":
      return styles.sevWarning;
    case "critical":
      return styles.sevCritical;
    default:
      return styles.sevInfo;
  }
}

function effortLabel(level: EffortLevel) {
  switch (level) {
    case "EASY":
      return "קל";
    case "NORMAL":
      return "בינוני";
    case "HARD":
      return "קשה";
    case "FAILED":
      return "נכשל";
    case "SKIPPED":
      return "דילוג";
  }
}

const ORDER: EffortLevel[] = ["EASY", "NORMAL", "HARD", "FAILED", "SKIPPED"];

const RecoveryBurnoutAlert = memo(({ recovery }: Props) => {
  const sev = recovery.risk.severity;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.sectionTitle}>התאוששות ועומס</Text>
          <Text style={styles.sectionSub}>אמינות: {recovery.confidence}</Text>
        </View>

        <View style={[styles.riskPill, severityStyle(sev)]}>
          <Text style={styles.riskPillText}>{recovery.risk.level}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={[styles.indicator, severityStyle(sev)]} />
          <View style={styles.statusTextWrap}>
            <Text style={styles.statusTitle}>{recovery.risk.title}</Text>
            <Text style={styles.statusDesc}>{recovery.risk.explanation}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>רצף ימים קשים</Text>
            <Text style={styles.gridValue}>{recovery.signals.consecutiveHardDays}</Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>כשל/דילוג</Text>
            <Text style={styles.gridValue}>{recovery.signals.failedOrSkippedCount}</Text>
          </View>

          {typeof recovery.signals.lowSleepDays === "number" ? (
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>ימים עם שינה נמוכה</Text>
              <Text style={styles.gridValue}>{recovery.signals.lowSleepDays}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.divider} />

        <Text style={styles.blockTitle}>חלוקת עצימות</Text>
        <View style={styles.distributionRow}>
          {ORDER.map((level) => (
            <View key={level} style={styles.levelChip}>
              <Text style={styles.levelLabel}>{effortLabel(level)}</Text>
              <Text style={styles.levelCount}>{recovery.effortDistribution[level] ?? 0}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.blockTitle}>המלצות לשבוע הקרוב</Text>
        <View style={styles.actionsList}>
          {(recovery.recommendedActions ?? []).slice(0, 3).map((a, idx) => (
            <View key={`${a.label}-${idx}`} style={styles.actionItem}>
              <Text style={styles.actionBullet}>•</Text>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionLabel}>{a.label}</Text>
                {a.details ? <Text style={styles.actionDetails}>{a.details}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

export default RecoveryBurnoutAlert;
