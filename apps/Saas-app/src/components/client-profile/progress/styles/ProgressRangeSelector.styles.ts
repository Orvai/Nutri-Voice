// src/components/client-profile/progress/styles/ProgressRangeSelector.styles.ts
import { StyleSheet } from "react-native";
import { progressTheme } from "../../../../theme/progressTheme";

export const ITEM_H = 44;
export const WHEEL_PADDING_ITEMS = 2;

export const styles = StyleSheet.create({
  outerContainer: { marginTop: 10, marginBottom: 6 },

  presetsRow: {
    flexDirection: "row-reverse",
    gap: 10,
    marginBottom: 10,
  },

  presetBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: progressTheme.radius.sub,
    backgroundColor: progressTheme.colors.surface2,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  activePresetBtn: {
    backgroundColor: progressTheme.colors.accentSoft,
    borderColor: progressTheme.colors.accentBorder,
  },

  presetText: {
    color: progressTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  activePresetText: { color: progressTheme.colors.text },

  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: progressTheme.radius.card,
    backgroundColor: progressTheme.colors.surface,
    padding: 14,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  infoSection: { flex: 1 },

  label: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  dateRange: {
    marginTop: 6,
    color: progressTheme.colors.text,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  miniNote: {
    marginTop: 4,
    color: progressTheme.colors.textDim,
    fontSize: 12,
    textAlign: "right",
    writingDirection: "rtl",
  },

  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: progressTheme.radius.sub,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    marginLeft: 12,
  },

  editBtnText: {
    color: progressTheme.colors.text,
    fontSize: 12,
    fontWeight: "900",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  modalCard: {
    width: "100%",
    borderRadius: progressTheme.radius.card,
    backgroundColor: progressTheme.colors.surface,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    padding: 14,
  },

  modalHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  modalTitle: {
    color: progressTheme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  modalClose: {
    color: progressTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
  },

  modalSub: {
    marginTop: 10,
    color: progressTheme.colors.text,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  modalPreview: {
    marginTop: 6,
    color: progressTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },

  wheelsRow: {
    marginTop: 14,
    flexDirection: "row-reverse",
    gap: 12,
  },

  wheelWrap: { flex: 1 },

  wheelLabel: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 8,
  },

  wheelFrame: {
    height: ITEM_H * (WHEEL_PADDING_ITEMS * 2 + 3),
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    overflow: "hidden",
    position: "relative",
  },

  wheelHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    top: ITEM_H * WHEEL_PADDING_ITEMS + ITEM_H,
    height: ITEM_H,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  wheelContent: {},

  wheelItem: {
    height: ITEM_H,
    alignItems: "center",
    justifyContent: "center",
  },

  wheelItemText: {
    color: progressTheme.colors.text,
    fontSize: 14,
    fontWeight: "900",
  },

  modalFooter: {
    marginTop: 14,
    flexDirection: "row-reverse",
    gap: 10,
  },

  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: progressTheme.radius.sub,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    alignItems: "center",
  },

  secondaryBtnText: {
    color: progressTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
  },

  primaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: progressTheme.radius.sub,
    backgroundColor: progressTheme.colors.accentSoft,
    borderWidth: 1,
    borderColor: progressTheme.colors.accentBorder,
    alignItems: "center",
  },

  primaryBtnText: {
    color: progressTheme.colors.text,
    fontSize: 12,
    fontWeight: "900",
  },
});
