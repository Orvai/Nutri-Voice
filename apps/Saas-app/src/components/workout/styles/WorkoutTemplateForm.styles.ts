import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  label: {
    fontWeight: "700",
    textAlign: "right",
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    backgroundColor: colors.white,
    textAlign: "right",
  },

  textArea: {
    minHeight: 80,
  },

  musclesWrap: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },

  optionsWrap: {
    flexDirection: "row-reverse",
    gap: 8,
    flexWrap: "wrap",
  },

  actions: {
    flexDirection: "row-reverse",
    gap: 10,
    marginTop: 12,
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: "#22c55e",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  primaryBtnDisabled: {
    opacity: 0.4,
  },

  primaryText: {
    color: colors.white,
    fontWeight: "800",
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: colors.neutral200,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  field: {
    gap: 6,
  },
});