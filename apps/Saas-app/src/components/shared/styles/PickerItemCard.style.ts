import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  containerSelected: {
    borderColor: "#2563eb",
  },
  containerUnselected: {
    borderColor: "#e5e7eb",
  },
  row: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontWeight: "700",
    textAlign: "right",
  },
  text: {
    color: "#6b7280",
    fontSize: 12,
    textAlign: "right",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#2563eb",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
});