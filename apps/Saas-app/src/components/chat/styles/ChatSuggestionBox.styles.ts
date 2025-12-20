import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },

  input: {
    minHeight: 80,
    maxHeight: 160,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    textAlign: "right",
    textAlignVertical: "top",
    fontSize: 14,
    color: "#111827",
  },

  sendButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#2563eb",
  },

  sendText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
