import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  userRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  status: {
    fontSize: 12,
    color: "#16a34a",
  },
});