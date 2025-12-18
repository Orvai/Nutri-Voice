import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
  },
  rowLeft: {
    flexDirection: "row-reverse",
    gap: 10,
    alignItems: "center",
  },
  value: {
    fontWeight: "700",
  },
});
