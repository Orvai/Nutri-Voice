import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 28,
    gap: 14,
  },

  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 14,
  },

  addCard: {
    width: "48%",
    minHeight: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    gap: 6,
  },

  addIcon: {
    fontSize: 32,
    color: "#64748b",
  },

  addText: {
    fontSize: 13,
  },

  skeleton: {
    width: "48%",
    height: 120,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
  },

  emptyBox: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 24,
  },

  emptyText: {
    fontSize: 14,
  },

  primaryCta: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  primaryCtaText: {
    color: "#fff",
    fontWeight: "700",
  },

  errorBox: {
    backgroundColor: "#fff1f2",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#fecdd3",
    gap: 8,
  },

  errorText: {
    textAlign: "right",
    color: "#b91c1c",
  },

  retryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#ef4444",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  retryText: {
    color: "#fff",
    fontWeight: "700",
  },

  headerCta: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },

  headerCtaText: {
    color: "#fff",
    fontWeight: "600",
  },
});
