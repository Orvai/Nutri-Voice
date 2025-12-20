import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
    flexDirection: "row-reverse",
    gap: 10,
  },
  button: {
    padding: 12,
    backgroundColor: colors.neutral100,
    borderRadius: 12,
  },
  row: {
    flex: 1,
  },
  input: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    textAlign: "right",
  },
  sendButton: {
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: "center",
  },
});