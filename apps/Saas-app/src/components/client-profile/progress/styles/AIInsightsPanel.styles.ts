// src/components/client-profile/progress/styles/AIInsightsPanel.styles.ts
import { StyleSheet } from "react-native";
import { progressTheme } from "../../../../theme/progressTheme";

export const styles = StyleSheet.create({
  container: { marginTop: 14 },

  sectionHeader: {
    color: progressTheme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 10,
  },

  card: {
    backgroundColor: progressTheme.colors.surface,
    borderRadius: progressTheme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    marginBottom: 10,
  },

  cardHeaderRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  titleWrap: { flex: 1 },

  title: {
    color: progressTheme.colors.text,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  subTitle: {
    marginTop: 2,
    color: progressTheme.colors.textDim,
    fontSize: 12,
    textAlign: "right",
    writingDirection: "rtl",
  },

  explanation: {
    marginTop: 10,
    color: progressTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },

  sevPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: progressTheme.radius.pill,
    borderWidth: 1,
  },

  sevPillText: {
    color: progressTheme.colors.text,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  evidenceRow: {
    marginTop: 10,
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },

  evidenceChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: progressTheme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  evidenceText: {
    color: progressTheme.colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  actionsBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: progressTheme.radius.sub,
    backgroundColor: progressTheme.colors.surface2,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  actionsTitle: {
    color: progressTheme.colors.text,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 8,
  },

  actionItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 6,
  },

  actionBullet: {
    color: progressTheme.colors.textDim,
    fontSize: 16,
    marginTop: -1,
  },

  actionTextWrap: { flex: 1 },

  actionLabel: {
    color: progressTheme.colors.text,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  actionDetails: {
    marginTop: 2,
    color: progressTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },

  sevSuccess: {
    backgroundColor: progressTheme.colors.successSoft,
    borderColor: progressTheme.colors.successBorder,
  },
  sevWarning: {
    backgroundColor: progressTheme.colors.warningSoft,
    borderColor: progressTheme.colors.warningBorder,
  },
  sevCritical: {
    backgroundColor: progressTheme.colors.dangerSoft,
    borderColor: progressTheme.colors.dangerBorder,
  },

  // Info is accent-soft (purple), not blue
  sevInfo: {
    backgroundColor: progressTheme.colors.accentSoft,
    borderColor: progressTheme.colors.accentBorder,
  },
});
