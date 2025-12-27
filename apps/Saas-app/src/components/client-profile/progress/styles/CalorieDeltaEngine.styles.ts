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
    borderRadius: progressTheme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
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
    marginTop: 14,
    height: 92,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
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
    backgroundColor: "rgba(239,68,68,0.90)",
  },

  barNegative: {
    backgroundColor: "rgba(34,197,94,0.90)",
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
