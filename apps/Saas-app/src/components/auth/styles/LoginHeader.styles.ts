import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "right",
  },
  text: {
    fontSize: 16,
    color: colors.neutral500,
    textAlign: "right",
  },
});