import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginTop: 8,
  },

  fileRow: {
    borderWidth: 1,
    padding: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },

  pickButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.neutral100,
  },

  fileName: {
    flex: 1,
    textAlign: "right",
    fontSize: 12,
  },

  pickText: {
    textAlign: "right",
    fontWeight: "700",
    fontSize: 12,
  },

  actionsRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },

  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.neutral100,
  },

  clearText: {
    color: colors.neutral700,
    fontWeight: "700",
  },

  uploadButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    flex: 1,
  },

  uploadDisabled: {
    backgroundColor: "#cbd5e1",
  },

  uploadText: {
    color: colors.white,
    fontWeight: "800",
  },
});
