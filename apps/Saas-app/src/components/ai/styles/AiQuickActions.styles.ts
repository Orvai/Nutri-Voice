import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 30,
    justifyContent: "center",
  },
  button: {
    width: "45%",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 14,
    padding: 16,
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    backgroundColor: "#eff6ff",
    padding: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.neutral800,
  },
  text: {
    textAlign: "right",
    fontSize: 13,
    color: colors.neutral500,
    marginTop: 8,
  },
});