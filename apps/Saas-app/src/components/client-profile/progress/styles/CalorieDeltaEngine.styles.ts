// src/components/client-profile/progress/styles/CalorieDeltaEngine.styles.ts
import { StyleSheet } from "react-native";
import { progressTheme } from "../../../../theme/progressTheme";

export const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },

  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },

  sectionTitle: {
    color: progressTheme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  sectionSub: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    marginTop: 3,
    textAlign: "right",
    writingDirection: "rtl",
  },

  mainCard: {
    backgroundColor: progressTheme.colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    ...progressTheme.shadow.card,
  },

  kpiRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(15,23,42,0.03)",
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    borderRadius: progressTheme.radius.sub,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  kpiLabel: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },
  kpiGood: { color: progressTheme.colors.success },
  kpiDanger: { color: progressTheme.colors.danger },

  legendRow: {
    marginTop: 12,
    marginBottom: 6,
    flexDirection: "row-reverse",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
  },
  legendText: {
    color: progressTheme.colors.textDim,
    fontSize: 11,
    fontWeight: "800",
  },

  summaryRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  summaryItem: {
    flex: 1,
  },

  summaryLabel: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    writingDirection: "rtl",
  },

  summaryValue: {
    color: progressTheme.colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 6,
    textAlign: "right",
    writingDirection: "rtl",
  },

  divider: {
    width: 1,
    height: 34,
    backgroundColor: progressTheme.colors.border,
  },

  chart: {
    marginTop: 8,
    height: 92,
    borderRadius: 16,
    backgroundColor: "rgba(15,23,42,0.03)",
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    flexDirection: "row-reverse",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 10,
    position: "relative",
    overflow: "hidden",
  },

  zeroLine: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 32,
    height: 1,
    backgroundColor: progressTheme.colors.border,
  },

  barColumn: {
    width: 28,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },

  bar: {
    width: 16,
    borderRadius: 8,
  },

  barPositive: {
    backgroundColor: "rgba(220,38,38,0.9)",
  },

  barNegative: {
    backgroundColor: "rgba(22,163,74,0.9)",
  },

  barLabel: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "800",
  },

  footerNote: {
    marginTop: 10,
    color: progressTheme.colors.textDim,
    fontSize: 11,
    lineHeight: 15,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
