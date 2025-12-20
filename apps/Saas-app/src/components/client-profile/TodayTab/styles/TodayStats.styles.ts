import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: colors.neutral50,
    borderRadius: 10,
  },
  rowLeft: {
    flexDirection: "row-reverse",
    gap: 10,
    alignItems: "center",
  },
  value: {
    fontWeight: "700",
  },
});