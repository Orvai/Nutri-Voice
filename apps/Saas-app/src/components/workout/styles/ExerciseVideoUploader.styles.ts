import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    gap: 8,
    marginTop: 10,
  },

  pickButton: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
  },

  pickText: {
    textAlign: "right",
  },

  uploadButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  uploadDisabled: {
    backgroundColor: "#cbd5e1",
  },

  uploadText: {
    color: colors.white,
    fontWeight: "800",
  },
});