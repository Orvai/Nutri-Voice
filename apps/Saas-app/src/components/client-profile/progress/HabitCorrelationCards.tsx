// src/components/analytics/HabitCorrelationCards.tsx
import React, { memo } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles/HabitCorrelationCards.styles";
import type { CoachAnalytics, CorrelationDirection, ConfidenceLevel } from "@/types/ui/tracking/coach-analytics.ui";

type Props = {
  correlations: CoachAnalytics["correlations"];
};

function dirLabel(dir: CorrelationDirection) {
  switch (dir) {
    case "חיובי":
      return "משפר";
    case "שלילי":
      return "פוגע";
    default:
      return "לא חד";
  }
}

function dirStyle(dir: CorrelationDirection) {
  switch (dir) {
    case "חיובי":
      return styles.dirGood;
    case "שלילי":
      return styles.dirBad;
    default:
      return styles.dirNeutral;
  }
}

function confidenceStyle(c: ConfidenceLevel) {
  if (c === "גבוהה") return styles.confHigh;
  if (c === "בינונית") return styles.confMid;
  return styles.confLow;
}

const HabitCorrelationCards = memo(({ correlations }: Props) => {
  const items = correlations.items ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.sectionTitle}>קשרים בין הרגלים לביצועים</Text>
          <Text style={styles.sectionSub}>אמינות כללית: {correlations.confidence}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>אין מספיק נתונים כדי להציג קשרים משמעותיים.</Text>
          </View>
        ) : (
          items.slice(0, 4).map((it) => (
            <View key={it.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.icon}>{it.icon}</Text>

                <View style={styles.headerTextWrap}>
                  <Text style={styles.cardTitle}>{it.title}</Text>
                  {it.subtitle ? <Text style={styles.cardSub}>{it.subtitle}</Text> : null}
                </View>

                <View style={[styles.dirPill, dirStyle(it.direction)]}>
                  <Text style={styles.dirPillText}>{dirLabel(it.direction)}</Text>
                </View>
              </View>

              <Text style={styles.effectText}>{it.effect.summary}</Text>

              <View style={styles.metaRow}>
                <View style={[styles.metaChip, confidenceStyle(it.confidence)]}>
                  <Text style={styles.metaText}>אמינות: {it.confidence}</Text>
                </View>

                <View style={styles.metaChip}>
                  <Text style={styles.metaText}>דגימות: {it.sampleSize}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
});

export default HabitCorrelationCards;
