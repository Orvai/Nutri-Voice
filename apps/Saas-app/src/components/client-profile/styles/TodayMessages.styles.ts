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
  message: {
    paddingBottom: 10,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  row: {
    flexDirection: "row-reverse",
    gap: 10,
    marginBottom: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  text: {
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: "#6b7280",
  },
  actionsRow: {
    flexDirection: "row-reverse",
    gap: 8,
  },
  actionPrimary: {
    backgroundColor: "#eff6ff",
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  actionSecondary: {
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  actionPrimaryText: {
    color: "#2563eb",
    fontSize: 12,
  },
  actionSecondaryText: {
    color: "#374151",
    fontSize: 12,
  },
  footer: {
    marginTop: 10,
    alignItems: "center",
  },
  footerText: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
