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
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
  },
  row: {
    flexDirection: "row-reverse",
    gap: 10,
    marginBottom: 12,
  },
  iconBox: {
    backgroundColor: "#eff6ff",
    padding: 10,
    borderRadius: 12,
  },
  muted: {
    color: "#6b7280",
    fontSize: 12,
  },
  boxesRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 12,
  },
  box: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
});
