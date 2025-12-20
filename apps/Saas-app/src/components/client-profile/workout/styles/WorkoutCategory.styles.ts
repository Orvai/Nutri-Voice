import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.neutral800,
    textAlign: "right",
  },
  addButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#eff6ff",
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 12,
    color: colors.neutral400,
    textAlign: "right",
    marginTop: 4,
  },
});