import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    textAlign: "right",
  },
  muscle: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "right",
    marginTop: 2,
  },
  stats: {
    alignItems: "flex-end",
    gap: 2,
  },
  statText: {
    fontSize: 11,
    color: "#374151",
  },
  strong: {
    fontWeight: "700",
  },
  remove: {
    marginTop: 6,
    alignSelf: "flex-end",
  },
  removeText: {
    color: "#dc2626",
    fontSize: 11,
  },
});
