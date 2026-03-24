import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { NeonCard } from "@/components/ui/NeonCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { HomeActivityRing } from "@/types/home/home.ui";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type ActivityRingsCardProps = {
  rings: HomeActivityRing[];
};

const ringGeometry = [
  { r: 40, strokeWidth: 8 },
  { r: 30, strokeWidth: 8 },
  { r: 20, strokeWidth: 8 }
];

export function ActivityRingsCard({ rings }: ActivityRingsCardProps) {
  return (
    <NeonCard style={styles.card}>
      <View style={styles.inner}>
        <View style={styles.ringContainer}>
          <Svg width={120} height={120} viewBox="0 0 100 100">
            {ringGeometry.map((shape, index) => {
              const ring = rings[index];
              if (!ring) {
                return null;
              }

              const circumference = 2 * Math.PI * shape.r;

              return (
                <G key={ring.label}>
                  <Circle
                    cx="50"
                    cy="50"
                    r={shape.r}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={shape.strokeWidth}
                    fill="transparent"
                  />
                  <Circle
                    cx="50"
                    cy="50"
                    r={shape.r}
                    stroke={ring.color}
                    strokeWidth={shape.strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={circumference - circumference * ring.progress}
                    origin="50, 50"
                    rotation="-90"
                  />
                </G>
              );
            })}
          </Svg>
        </View>

        <View style={styles.stats}>
          {rings.map((ring) => (
            <View key={ring.label} style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={[styles.metricLabel, { color: ring.color }]}>{ring.label}</Text>
                <Text style={styles.metricValue}>{ring.valueLabel}</Text>
              </View>
              <ProgressBar progress={ring.progress} color={ring.color} />
            </View>
          ))}
        </View>
      </View>
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg
  },
  inner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.lg
  },
  ringContainer: {
    width: 132,
    height: 132,
    alignItems: "center",
    justifyContent: "center"
  },
  stats: {
    flex: 1,
    gap: spacing.md
  },
  metricRow: {
    gap: spacing.xs
  },
  metricHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center"
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: "700"
  },
  metricValue: {
    fontSize: 12,
    color: colors.textSecondary
  }
});
