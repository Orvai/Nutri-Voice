import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "right",
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
    marginTop: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "800",
    color: "#2563eb",
  },
  notes: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#ffffff",
    textAlign: "right",
    marginBottom: 12,
    minHeight: 46,
  },
  footer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  deleteText: {
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "600",
  },
});
