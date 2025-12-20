import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.neutral800,
  },

  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  addButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 13,
  },

  emptyState: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.neutral50,
  },

  emptyText: {
    textAlign: "right",
    color: colors.neutral500,
    marginBottom: 8,
  },
});