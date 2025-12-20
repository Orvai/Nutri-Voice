import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
    textAlign: "right",
  },
});