import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },

  row: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },

  pickButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.neutral100,
  },

  fileName: {
    maxWidth: 130,
    textAlign: "right",
    fontSize: 11,
    lineHeight: 14,
  },

  filePlaceholder: {
    flex: 1,
    textAlign: "right",
    fontSize: 11,
  },

  pickText: {
    textAlign: "right",
    fontWeight: "700",
    fontSize: 11,
  },

  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
  },

  clearText: {
    color: colors.neutral700,
    fontWeight: "700",
    fontSize: 11,
  },

  uploadButton: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 72,
  },

  uploadDisabled: {
    backgroundColor: "#cbd5e1",
  },

  uploadText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 11,
  },
});
