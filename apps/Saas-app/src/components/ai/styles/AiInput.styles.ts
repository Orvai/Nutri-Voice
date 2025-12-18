import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row-reverse",
    gap: 10,
  },
  button: {
    padding: 12,
    backgroundColor: "#f3f4f6",
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
    backgroundColor: "#2563eb",
    borderRadius: 12,
    justifyContent: "center",
  },
});