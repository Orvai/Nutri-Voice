import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#99f6e4",
    padding: 10,
  },
  icon: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  text: {
    flex: 1,
  },
  input: {
    width: 60,
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 6,
    textAlign: "center",
    paddingVertical: 4,
  },
  inputEditable: {
    backgroundColor: colors.white,
  },
  inputDisabled: {
    backgroundColor: colors.neutral100,
  },
  subtext: {
    color: colors.neutral500,
    fontSize: 12,
  },
  value: {
    fontWeight: "600",
  },
  button: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
});