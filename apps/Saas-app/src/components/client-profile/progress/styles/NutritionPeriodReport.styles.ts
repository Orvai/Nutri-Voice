// src/components/client-profile/progress/styles/NutritionPeriodReport.styles.ts
import { StyleSheet } from "react-native";
import { progressTheme } from "../../../../theme/progressTheme";

export const styles = StyleSheet.create({
  container: { marginTop: 14 },

  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  titleWrap: { flex: 1 },

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

  card: {
    backgroundColor: progressTheme.colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    ...progressTheme.shadow.card,
  },

  calorieSection: {
    alignItems: "flex-end",
  },

  avgLabel: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  avgValue: {
    marginTop: 6,
    color: progressTheme.colors.text,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  unit: {
    marginTop: 2,
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  variabilityText: {
    marginTop: 8,
    color: progressTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },

  divider: {
    height: 1,
    backgroundColor: progressTheme.colors.border,
    marginVertical: 14,
  },

  adherenceCard: {
    borderRadius: progressTheme.radius.sub,
    padding: 12,
    borderWidth: 1,
  },
  adherenceLabel: {
    color: progressTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },
  adherenceValue: {
    color: progressTheme.colors.text,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 6,
  },
  adherenceSub: {
    color: progressTheme.colors.textDim,
    fontSize: 11,
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 4,
  },

  macroGrid: {
    flexDirection: "row-reverse",
    gap: 10,
  },

  tag: {
    flex: 1,
    borderRadius: progressTheme.radius.sub,
    padding: 12,
    backgroundColor: "rgba(15,23,42,0.03)",
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  tagLabel: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  tagValue: {
    marginTop: 6,
    color: progressTheme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },
  adherenceGood: {
    backgroundColor: progressTheme.colors.successSoft,
    borderColor: progressTheme.colors.successBorder,
  },
  adherenceMid: {
    backgroundColor: progressTheme.colors.warningSoft,
    borderColor: progressTheme.colors.warningBorder,
  },
  adherenceLow: {
    backgroundColor: progressTheme.colors.dangerSoft,
    borderColor: progressTheme.colors.dangerBorder,
  },
  proteinTag: {
    backgroundColor: "rgba(22,163,74,0.09)",
    borderColor: "rgba(22,163,74,0.2)",
  },
  carbTag: {
    backgroundColor: "rgba(37,99,235,0.09)",
    borderColor: "rgba(37,99,235,0.2)",
  },
  fatTag: {
    backgroundColor: "rgba(249,115,22,0.11)",
    borderColor: "rgba(249,115,22,0.25)",
  },
});
