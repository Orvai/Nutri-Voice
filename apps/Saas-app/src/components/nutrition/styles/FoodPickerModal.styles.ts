import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    maxHeight: "85%",
    gap: 12,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "800",
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: "right",
  },
  row: {
    flexDirection: "row-reverse",
    gap: 8,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  buttonActive: {
    backgroundColor: "#0f766e",
    borderColor: "#0f766e",
  },
  buttonInactive: {
    backgroundColor: "#f1f5f9",
    borderColor: "#e5e7eb",
  },
  text: {
    color: "#0f172a",
  },
  textActive: {
    color: "white",
  },
  textInactive: {
    color: "#0f172a",
  },
  message: {
    textAlign: "center",
    color: "#6b7280",
    padding: 10,
  },
});