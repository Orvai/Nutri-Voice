// src/components/analytics/CalorieDeltaEngine.tsx
import React, { memo, useMemo } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles/CalorieDeltaEngine.styles";
import type { CoachAnalytics, DayType } from "@/types/ui/tracking/coach-analytics.ui";

type Props = {
  data: CoachAnalytics["calorieBehavior"];
};

function dayTypeLabel(dt?: DayType) {
  if (dt === "TRAINING") return "א";
  if (dt === "REST") return "מ";
  return "•";
}

const CalorieDeltaEngine = memo(({ data }: Props) => {
  const last7 = data.last7 ?? [];

  const maxAbs = useMemo(() => {
    const m = Math.max(1, ...last7.map((x) => Math.abs(x.deltaKcal)));
    return m;
  }, [last7]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>התנהגות קלורית</Text>
          <Text style={styles.sectionSub}>
            אמינות: {data.confidence} • תנודתיות: {data.patterns.volatilityLabel}
          </Text>
        </View>
      </View>

      <View style={styles.mainCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>ימי חריגה</Text>
            <Text style={styles.summaryValue}>{data.patterns.bingeDays}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>ימי דיוק</Text>
            <Text style={styles.summaryValue}>{data.patterns.precisionDays}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>ממוצע דלתא</Text>
            <Text style={styles.summaryValue}>
              {Math.round(data.deltaStats.overall.mean)} kcal
            </Text>
          </View>
        </View>

        <View style={styles.chart}>
          <View style={styles.zeroLine} />

          {last7.map((d, i) => {
            const abs = Math.abs(d.deltaKcal);
            const height = Math.max(4, Math.round((abs / maxAbs) * 70));
            const isPositive = d.deltaKcal >= 0;

            return (
              <View key={i} style={styles.barColumn}>
                <View
                  style={[
                    styles.bar,
                    { height },
                    isPositive ? styles.barPositive : styles.barNegative,
                  ]}
                />
                <Text style={styles.barLabel}>{dayTypeLabel(d.dayType)}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.footerNote}>
          * 7 ימים אחרונים: א=אימון, מ=מנוחה. גובה העמודה לפי חריגה יחסית בתקופה.
        </Text>
      </View>
    </View>
  );
});

export default CalorieDeltaEngine;
