import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingHorizontal: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 12,
    textAlign: "right",
  },
  sendButton: {
    backgroundColor: "#2563eb",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});