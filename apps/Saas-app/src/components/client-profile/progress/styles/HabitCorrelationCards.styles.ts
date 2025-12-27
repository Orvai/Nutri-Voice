// src/components/client-profile/progress/styles/HabitCorrelationCards.styles.ts
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

  grid: { gap: 10 },

  card: {
    backgroundColor: progressTheme.colors.surface,
    borderRadius: progressTheme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  cardHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  icon: { fontSize: 18 },

  headerTextWrap: { flex: 1 },

  cardTitle: {
    color: progressTheme.colors.text,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  cardSub: {
    marginTop: 2,
    color: progressTheme.colors.textDim,
    fontSize: 12,
    textAlign: "right",
    writingDirection: "rtl",
  },

  dirPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: progressTheme.radius.pill,
    borderWidth: 1,
  },

  dirPillText: {
    color: progressTheme.colors.text,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  effectText: {
    marginTop: 10,
    color: progressTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },

  metaRow: {
    marginTop: 10,
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },

  metaChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: progressTheme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  metaText: {
    color: progressTheme.colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  emptyCard: {
    backgroundColor: progressTheme.colors.surface,
    borderRadius: progressTheme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  emptyText: {
    color: progressTheme.colors.textMuted,
    fontSize: 13,
    textAlign: "right",
    writingDirection: "rtl",
  },

  dirGood: {
    backgroundColor: progressTheme.colors.successSoft,
    borderColor: progressTheme.colors.successBorder,
  },
  dirBad: {
    backgroundColor: progressTheme.colors.dangerSoft,
    borderColor: progressTheme.colors.dangerBorder,
  },

  // Neutral uses accent softly (purple), not blue
  dirNeutral: {
    backgroundColor: progressTheme.colors.accentSoft,
    borderColor: progressTheme.colors.accentBorder,
  },

  confHigh: {
    backgroundColor: progressTheme.colors.successSoft,
    borderColor: progressTheme.colors.successBorder,
  },
  confMid: {
    backgroundColor: progressTheme.colors.warningSoft,
    borderColor: progressTheme.colors.warningBorder,
  },
  confLow: {
    backgroundColor: progressTheme.colors.dangerSoft,
    borderColor: progressTheme.colors.dangerBorder,
  },
});
