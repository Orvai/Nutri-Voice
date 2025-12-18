import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  errorContainer: {
    padding: 20,
  },

  errorText: {
    color: "red",
  },

  emptyContainer: {
    padding: 20,
  },

  scroll: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  scrollContent: {
    padding: 20,
  },

  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  badge: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    opacity: 0.8,
  },

  badgeText: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 13,
  },

  loaderContainer: {
    padding: 20,
  },
});
