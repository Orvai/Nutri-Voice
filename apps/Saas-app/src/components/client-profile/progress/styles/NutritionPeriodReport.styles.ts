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
    borderRadius: progressTheme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
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
    fontSize: 28,
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
    marginVertical: 12,
  },

  macroGrid: {
    flexDirection: "row-reverse",
    gap: 10,
  },

  tag: {
    flex: 1,
    borderRadius: progressTheme.radius.sub,
    padding: 12,
    backgroundColor: progressTheme.colors.surface2,
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
});
