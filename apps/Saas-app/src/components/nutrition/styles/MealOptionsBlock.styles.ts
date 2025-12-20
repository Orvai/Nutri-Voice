import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  containerActive: {
    borderColor: "#4f46e5",
    backgroundColor: "#eef2ff",
  },
  containerInactive: {
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontWeight: "700",
    fontSize: 15,
  },
  removeText: {
    color: "#ef4444",
    fontWeight: "700",
  },
  addButton: {
    marginTop: 8,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 13,
  },
});