import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 30,
    justifyContent: "center",
  },
  button: {
    width: "45%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    backgroundColor: "#eff6ff",
    padding: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  text: {
    textAlign: "right",
    fontSize: 13,
    color: "#6b7280",
    marginTop: 8,
  },
});
