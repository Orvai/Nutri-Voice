import { StyleSheet } from "react-native";

import { progressTheme } from "../../../../theme/progressTheme";

export const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 10,
    marginBottom: 6,
    gap: 8,
  },

  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    backgroundColor: progressTheme.colors.surface,
    padding: 16,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    ...progressTheme.shadow.card,
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
    fontSize: 15,
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

  calendarBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: progressTheme.radius.sub,
    backgroundColor: "rgba(37,99,235,0.12)",
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.3)",
    marginLeft: 12,
  },

  calendarBtnText: {
    color: "#1d4ed8",
    fontSize: 12,
    fontWeight: "900",
  },

  presetsRow: {
    flexDirection: "row-reverse",
    gap: 6,
  },

  presetBtn: {
    flex: 1,
    minHeight: 40,
    paddingVertical: 8,
    borderRadius: progressTheme.radius.sub,
    backgroundColor: "rgba(15,23,42,0.04)",
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  activePresetBtn: {
    backgroundColor: "rgba(37,99,235,0.12)",
    borderColor: "rgba(37,99,235,0.3)",
  },

  disabledPresetBtn: {
    opacity: 0.45,
  },

  presetText: {
    color: progressTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  activePresetText: {
    color: "#1d4ed8",
  },

  disabledPresetText: {
    color: progressTheme.colors.textDim,
  },

  unavailableText: {
    marginTop: 1,
    color: progressTheme.colors.textDim,
    fontSize: 10,
    fontWeight: "800",
  },

  availabilityText: {
    color: progressTheme.colors.textDim,
    fontSize: 11,
    textAlign: "right",
    writingDirection: "rtl",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.46)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 28,
  },

  modalCard: {
    width: "92%",
    maxWidth: 390,
    maxHeight: "82%",
    borderRadius: 18,
    backgroundColor: progressTheme.colors.surface,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    padding: 12,
    gap: 10,
  },

  modalScroll: {
    flexGrow: 0,
  },

  modalScrollContent: {
    gap: 10,
  },

  modalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: progressTheme.colors.text,
    textAlign: "right",
    writingDirection: "rtl",
  },

  closeBtn: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(15,23,42,0.06)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },

  closeBtnText: {
    fontSize: 10,
    fontWeight: "900",
    color: progressTheme.colors.textMuted,
  },

  modalRangeText: {
    fontSize: 12,
    color: progressTheme.colors.text,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  modalRangeSub: {
    marginTop: 1,
    fontSize: 10,
    color: progressTheme.colors.textDim,
    textAlign: "right",
    writingDirection: "rtl",
  },

  modalPresetRow: {
    flexDirection: "row-reverse",
    gap: 6,
  },

  modalPresetBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: progressTheme.radius.pill,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    backgroundColor: "rgba(15,23,42,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalPresetBtnActive: {
    backgroundColor: "rgba(37,99,235,0.16)",
    borderColor: "rgba(30,58,138,0.32)",
  },

  modalPresetBtnDisabled: {
    opacity: 0.45,
  },

  modalPresetText: {
    fontSize: 11,
    fontWeight: "900",
    color: progressTheme.colors.textMuted,
  },

  modalPresetTextActive: {
    color: "#1d4ed8",
  },

  modalPresetTextDisabled: {
    color: progressTheme.colors.textDim,
  },

  monthHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  monthLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: progressTheme.colors.text,
    textAlign: "center",
  },

  monthArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.06)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },

  weekdaysRow: {
    flexDirection: "row-reverse",
    marginTop: -2,
  },

  weekdayCell: {
    width: "14.285%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },

  weekdayText: {
    fontSize: 10,
    color: progressTheme.colors.textDim,
    fontWeight: "800",
  },

  monthGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
    borderRadius: 14,
    overflow: "hidden",
  },

  dayCell: {
    width: "14.285%",
    aspectRatio: 0.9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "rgba(15,23,42,0.06)",
    backgroundColor: progressTheme.colors.surface,
  },

  dayCellOutside: {
    backgroundColor: "rgba(148,163,184,0.08)",
  },

  dayCellInRange: {
    backgroundColor: "rgba(59,130,246,0.14)",
  },

  dayCellSelected: {
    backgroundColor: "#1d4ed8",
  },

  dayCellToday: {
    borderColor: "rgba(29,78,216,0.55)",
    borderWidth: 1,
  },

  dayCellDisabled: {
    opacity: 0.35,
  },

  dayText: {
    fontSize: 11,
    fontWeight: "800",
    color: progressTheme.colors.text,
  },

  dayTextOutside: {
    color: "rgba(15,23,42,0.44)",
  },

  dayTextSelected: {
    color: "#ffffff",
  },

  dayTextDisabled: {
    color: progressTheme.colors.textDim,
  },

  footer: {
    flexDirection: "row-reverse",
    gap: 8,
  },

  footerSecondary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: progressTheme.radius.sub,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.12)",
    backgroundColor: "rgba(15,23,42,0.04)",
    alignItems: "center",
  },

  footerSecondaryText: {
    fontSize: 11,
    fontWeight: "900",
    color: progressTheme.colors.textMuted,
  },

  footerPrimary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: progressTheme.radius.sub,
    borderWidth: 1,
    borderColor: "rgba(30,58,138,0.42)",
    backgroundColor: "rgba(37,99,235,0.16)",
    alignItems: "center",
  },

  footerPrimaryDisabled: {
    opacity: 0.45,
  },

  footerPrimaryText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#1e3a8a",
  },
});
