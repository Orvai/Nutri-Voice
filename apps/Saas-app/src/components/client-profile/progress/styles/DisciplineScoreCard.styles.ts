// src/components/client-profile/progress/styles/DisciplineScoreCard.styles.ts
import { StyleSheet } from "react-native";
import { progressTheme } from "../../../../theme/progressTheme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: progressTheme.colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    ...progressTheme.shadow.card,
  },

  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  titleWrap: {
    flex: 1,
  },

  title: {
    color: progressTheme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  subTitle: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    marginTop: 2,
    textAlign: "right",
    writingDirection: "rtl",
  },

  bandPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: progressTheme.radius.pill,
    backgroundColor: "rgba(15,23,42,0.04)",
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    marginLeft: 10,
  },

  bandText: {
    color: progressTheme.colors.text,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  mainContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },

  scoreCircle: {
    width: 84,
    height: 84,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(248,250,252,0.8)",
  },
  scoreSuccess: { borderColor: progressTheme.colors.successBorder },
  scoreWarning: { borderColor: progressTheme.colors.warningBorder },
  scoreCritical: { borderColor: progressTheme.colors.dangerBorder },

  scoreValue: {
    color: progressTheme.colors.text,
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 26,
  },

  scorePercent: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "800",
    marginTop: -2,
  },

  textDetails: {
    flex: 1,
  },

  statusText: {
    fontSize: 14,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  statusSuccess: { color: progressTheme.colors.success },
  statusWarning: { color: progressTheme.colors.warning },
  statusCritical: { color: progressTheme.colors.danger },

  hintText: {
    marginTop: 6,
    color: progressTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },

  divider: {
    height: 1,
    backgroundColor: progressTheme.colors.border,
    marginVertical: 12,
  },

  metricsGrid: {
    gap: 10,
  },

  metricEntry: {
    padding: 10,
    borderRadius: progressTheme.radius.sub,
    backgroundColor: "rgba(15,23,42,0.03)",
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },
  metricTopRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  metricLabel: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    writingDirection: "rtl",
  },

  metricValue: {
    color: progressTheme.colors.text,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },
  metricTrack: {
    marginTop: 8,
    height: 7,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.08)",
    overflow: "hidden",
  },
  metricFill: {
    height: "100%",
    borderRadius: 999,
  },
  metricGood: { backgroundColor: progressTheme.colors.success },
  metricMid: { backgroundColor: progressTheme.colors.warning },
  metricLow: { backgroundColor: progressTheme.colors.danger },
});
