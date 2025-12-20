import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  row: {
    paddingVertical: 12,
    borderColor: colors.neutral200,
  },
  rowBorder: {
    borderBottomWidth: 1,
  },
  strong: {
    fontWeight: "700",
  },
});