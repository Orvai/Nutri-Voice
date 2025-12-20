import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.neutral200,
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
  },
});