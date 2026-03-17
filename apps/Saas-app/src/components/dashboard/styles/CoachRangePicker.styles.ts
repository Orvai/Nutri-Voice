import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.09)",
    backgroundColor: "#ffffff",
    padding: 14,
    gap: 12,
  },

  topRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  labelWrap: { flex: 1 },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(15,23,42,0.62)",
    textAlign: "right",
  },
  value: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "right",
  },
  valueMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(15,23,42,0.58)",
    textAlign: "right",
  },

  calendarBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.12)",
    backgroundColor: "rgba(37,99,235,0.08)",
  },
  calendarBtnText: {
    color: "#1e3a8a",
    fontSize: 12,
    fontWeight: "900",
  },

  quickRow: {
    flexDirection: "row-reverse",
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.1)",
    backgroundColor: "rgba(15,23,42,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  quickBtnActive: {
    backgroundColor: "rgba(37,99,235,0.16)",
    borderColor: "rgba(30,58,138,0.32)",
  },
  quickBtnText: {
    fontSize: 12,
    fontWeight: "900",
    color: "rgba(15,23,42,0.75)",
  },
  quickBtnTextActive: {
    color: "#1e3a8a",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.62)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.12)",
    padding: 16,
    gap: 14,
  },

  modalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "right",
  },
  closeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(15,23,42,0.06)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },
  closeBtnText: {
    fontSize: 11,
    fontWeight: "900",
    color: "rgba(15,23,42,0.72)",
  },

  modalRangeText: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "800",
    textAlign: "right",
  },
  modalRangeSub: {
    marginTop: 2,
    fontSize: 11,
    color: "rgba(15,23,42,0.58)",
    textAlign: "right",
  },

  monthHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "center",
  },
  monthArrow: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.06)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },

  weekdaysRow: {
    flexDirection: "row-reverse",
    marginTop: -4,
  },
  weekdayCell: {
    width: "14.285%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  weekdayText: {
    fontSize: 11,
    color: "rgba(15,23,42,0.6)",
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
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "rgba(15,23,42,0.06)",
    backgroundColor: "#ffffff",
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
  dayText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0f172a",
  },
  dayTextOutside: {
    color: "rgba(15,23,42,0.44)",
  },
  dayTextSelected: {
    color: "#ffffff",
  },

  footer: {
    flexDirection: "row-reverse",
    gap: 10,
  },
  footerSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.12)",
    backgroundColor: "rgba(15,23,42,0.04)",
    alignItems: "center",
  },
  footerSecondaryText: {
    fontSize: 12,
    fontWeight: "900",
    color: "rgba(15,23,42,0.74)",
  },
  footerPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(30,58,138,0.42)",
    backgroundColor: "rgba(37,99,235,0.16)",
    alignItems: "center",
  },
  footerPrimaryDisabled: {
    opacity: 0.45,
  },
  footerPrimaryText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1e3a8a",
  },
});
