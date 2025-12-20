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
  centerText: {
    textAlign: "center",
  },
  mainValue: {
    fontSize: 26,
    fontWeight: "700",
  },
  muted: {
    color: colors.neutral500,
  },
  footer: {
    marginTop: 16,
    fontSize: 12,
  },
  macroRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: 10,
  },
});