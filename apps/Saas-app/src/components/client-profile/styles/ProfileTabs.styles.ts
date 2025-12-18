import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 14,
    marginLeft: 20,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderColor: "#2563eb",
  },
  labelActive: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563eb",
  },
  labelInactive: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
});
