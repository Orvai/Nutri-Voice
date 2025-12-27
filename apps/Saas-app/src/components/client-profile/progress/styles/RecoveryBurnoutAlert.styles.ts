// src/components/client-profile/progress/styles/RecoveryBurnoutAlert.styles.ts
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

  riskPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: progressTheme.radius.pill,
    borderWidth: 1,
    marginLeft: 10,
  },

  riskPillText: {
    color: progressTheme.colors.text,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  statusRow: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 10,
  },

  indicator: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 6,
  },

  statusTextWrap: { flex: 1 },

  statusTitle: {
    color: progressTheme.colors.text,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  statusDesc: {
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

  grid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 10,
  },

  gridItem: {
    flex: 1,
    padding: 10,
    borderRadius: progressTheme.radius.sub,
    backgroundColor: progressTheme.colors.surface2,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  gridLabel: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    writingDirection: "rtl",
  },

  gridValue: {
    marginTop: 6,
    color: progressTheme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  blockTitle: {
    color: progressTheme.colors.text,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 8,
  },

  distributionRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },

  levelChip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: progressTheme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  levelLabel: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  levelCount: {
    color: progressTheme.colors.text,
    fontSize: 12,
    fontWeight: "900",
  },

  actionsList: { gap: 8 },

  actionItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 8,
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

  // Info is neutral now (no blue). Use accent softly only if you want.
  sevInfo: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: progressTheme.colors.border,
  },
});
