import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonActive: {
    backgroundColor: "#2563eb",
  },
  buttonInactive: {
    backgroundColor: "#f3f4f6",
  },
  textActive: {
    color: "#fff",
    fontWeight: "600",
  },
  textInactive: {
    color: "#374151",
    fontWeight: "600",
  },
});
