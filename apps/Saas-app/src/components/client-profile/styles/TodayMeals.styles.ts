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
  meal: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: "row-reverse",
    gap: 8,
  },
  badge: {
    backgroundColor: "#ecfdf5",
    color: "#0f766e",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
  },
  muted: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row-reverse",
    gap: 14,
  },
  footerText: {
    fontSize: 12,
    color: "#6b7280",
  },
});
