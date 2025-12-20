import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

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
    backgroundColor: colors.neutral100,
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
    backgroundColor: colors.neutral200,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    opacity: 0.8,
  },

  badgeText: {
    color: colors.neutral700,
    fontWeight: "700",
    fontSize: 13,
  },

  loaderContainer: {
    padding: 20,
  },
});