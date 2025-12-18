import { StyleSheet } from "react-native";

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
    color: "#dc2626",
    fontWeight: "700",
  },

  retryButton: {
    alignSelf: "flex-end",
  },

  retryText: {
    color: "#2563eb",
  },
});
