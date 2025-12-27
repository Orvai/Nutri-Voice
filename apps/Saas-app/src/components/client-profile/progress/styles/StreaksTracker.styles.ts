// src/components/client-profile/progress/styles/StreaksTracker.styles.ts
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

  qualityPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: progressTheme.radius.pill,
    borderWidth: 1,
    marginLeft: 10,
  },

  qualityText: {
    color: progressTheme.colors.text,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  row: {
    flexDirection: "row-reverse",
    gap: 10,
  },

  card: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    backgroundColor: progressTheme.colors.surface,
    borderRadius: progressTheme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  emoji: { fontSize: 20 },

  textContainer: { flex: 1 },

  label: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  valueRow: {
    flexDirection: "row-reverse",
    alignItems: "baseline",
    gap: 6,
    marginTop: 6,
  },

  currentValue: {
    color: progressTheme.colors.text,
    fontSize: 20,
    fontWeight: "900",
  },

  maxValue: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  note: {
    marginTop: 6,
    color: progressTheme.colors.textDim,
    fontSize: 11,
    textAlign: "right",
    writingDirection: "rtl",
  },

  qStrong: {
    backgroundColor: progressTheme.colors.successSoft,
    borderColor: progressTheme.colors.successBorder,
  },
  qMid: {
    backgroundColor: progressTheme.colors.warningSoft,
    borderColor: progressTheme.colors.warningBorder,
  },
  qWeak: {
    backgroundColor: progressTheme.colors.dangerSoft,
    borderColor: progressTheme.colors.dangerBorder,
  },
});
