import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  loadingContainer: {
    padding: 16,
  },

  errorContainer: {
    padding: 16,
    gap: 8,
  },

  errorText: {
    textAlign: "right",
    color: colors.danger,
    fontWeight: "700",
  },

  retryButton: {
    alignSelf: "flex-end",
  },

  retryText: {
    color: colors.primary,
  },
});