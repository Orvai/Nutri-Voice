// src/components/analytics/AIInsightsPanel.tsx
import React, { memo } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles/AIInsightsPanel.styles";
import type { CoachAnalytics, CoachInsight, Severity } from "@/types/ui/tracking/coach-analytics.ui";

type Props = {
  insights?: CoachAnalytics["insights"];
};

function sevLabel(sev: Severity) {
  switch (sev) {
    case "critical":
      return "דחוף";
    case "warning":
      return "שווה לשים לב";
    case "success":
      return "חזק";
    default:
      return "מידע";
  }
}

function sevStyle(sev: Severity) {
  switch (sev) {
    case "critical":
      return styles.sevCritical;
    case "warning":
      return styles.sevWarning;
    case "success":
      return styles.sevSuccess;
    default:
      return styles.sevInfo;
  }
}

function normalizeInsights(input?: CoachInsight[]): CoachInsight[] {
  return (input ?? []).slice(0, 3);
}

const AIInsightsPanel = memo(({ insights }: Props) => {
  const safe = normalizeInsights(insights);
  if (safe.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>תובנות חכמות למאמן</Text>

      {safe.map((it) => (
        <View key={it.id} style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.sevPill, sevStyle(it.severity)]}>
              <Text style={styles.sevPillText}>{sevLabel(it.severity)}</Text>
            </View>

            <View style={styles.titleWrap}>
              <Text style={styles.title}>{it.title}</Text>
              <Text style={styles.subTitle}>אמינות: {it.confidence}</Text>
            </View>
          </View>

          <Text style={styles.explanation}>{it.explanation}</Text>

          {it.evidence?.length ? (
            <View style={styles.evidenceRow}>
              {it.evidence.slice(0, 3).map((e, idx) => (
                <View key={`${it.id}-e-${idx}`} style={styles.evidenceChip}>
                  <Text style={styles.evidenceText}>
                    {e.label}: {e.value}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {it.actions?.length ? (
            <View style={styles.actionsBox}>
              <Text style={styles.actionsTitle}>מה עושים</Text>

              {(it.actions ?? []).slice(0, 2).map((a, idx) => (
                <View key={`${it.id}-a-${idx}`} style={styles.actionItem}>
                  <Text style={styles.actionBullet}>•</Text>
                  <View style={styles.actionTextWrap}>
                    <Text style={styles.actionLabel}>{a.label}</Text>
                    {a.details ? <Text style={styles.actionDetails}>{a.details}</Text> : null}
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
});

export default AIInsightsPanel;
