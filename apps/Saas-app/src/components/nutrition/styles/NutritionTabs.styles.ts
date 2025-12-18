import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    gap: 8,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  buttonActive: {
    backgroundColor: "#e0f2fe",
    borderBottomWidth: 3,
    borderBottomColor: "#0284c7",
  },
  buttonInactive: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  text: {
    fontWeight: "500",
    color: "#6b7280",
  },
  textActive: {
    fontWeight: "700",
    color: "#0284c7",
  },
  textInactive: {
    fontWeight: "500",
    color: "#6b7280",
  },
});