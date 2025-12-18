import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    color: "#374151",
  },
  valueContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  valueText: {
    fontWeight: "700",
  },
});