import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
  },
  info: {
    alignItems: "flex-end",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
  },
  muted: {
    color: "#6b7280",
    fontSize: 14,
  },
  action: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  actionText: {
    fontSize: 14,
    color: "#fff",
  },
  actionIcon: {
    marginLeft: 6,
  },
});
