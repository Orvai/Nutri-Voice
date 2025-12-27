// src/components/client-profile/progress/styles/DisciplineScoreCard.styles.ts
import { StyleSheet } from "react-native";
import { progressTheme } from "../../../../theme/progressTheme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: progressTheme.colors.surface,
    borderRadius: progressTheme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
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
    fontWeight: "800",
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
    backgroundColor: progressTheme.colors.surface2,
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
    width: 76,
    height: 76,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  scoreValue: {
    color: progressTheme.colors.text,
    fontSize: 22,
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
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 10,
  },

  metricEntry: {
    flex: 1,
    padding: 10,
    borderRadius: progressTheme.radius.sub,
    backgroundColor: progressTheme.colors.surface2,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  metricLabel: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    writingDirection: "rtl",
  },

  metricValue: {
    marginTop: 6,
    color: progressTheme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },
});
