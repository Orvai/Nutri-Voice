import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f9fafb" },
  page: { padding: 20, gap: 18 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.08)",
  },

  cardAttention: {
    borderColor: "rgba(239,68,68,0.28)",
    backgroundColor: "rgba(254,226,226,0.65)", // inspiration: #fee2e2
  },
  cardOk: {
    backgroundColor: "rgba(34,197,94,0.06)",
    borderColor: "rgba(34,197,94,0.16)",
  },
  cardWarn: {
    backgroundColor: "rgba(245,158,11,0.06)",
    borderColor: "rgba(245,158,11,0.18)",
  },

  rowReverse: { flexDirection: "row-reverse", alignItems: "center" },

  title: { fontSize: 14, fontWeight: "900", color: "#111827", textAlign: "right" },
  meta: { marginTop: 2, fontSize: 12, color: "rgba(17,24,39,0.55)", textAlign: "right" },
  text: { fontSize: 13, color: "rgba(17,24,39,0.75)", textAlign: "right", lineHeight: 18 },

  pill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(17,24,39,0.04)",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  pillText: { fontSize: 12, color: "#111827", fontWeight: "800" },

  ghostBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(17,24,39,0.06)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.08)",
  },
  ghostBtnText: { fontSize: 12, fontWeight: "900", color: "#111827" },

  secondaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(17,24,39,0.06)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.08)",
    alignSelf: "flex-start",
  },
  secondaryBtnText: { fontSize: 12, fontWeight: "900", color: "#111827" },

  sectionHeader: { flexDirection: "row-reverse", alignItems: "flex-end", gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: "#111827", textAlign: "right" },
  sectionSub: { fontSize: 12, marginTop: 2, color: "rgba(17,24,39,0.55)", textAlign: "right" },
});
