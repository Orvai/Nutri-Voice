import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#99f6e4",
    padding: 10,
  },
  icon: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  text: {
    flex: 1,
  },
  input: {
    width: 60,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    textAlign: "center",
    paddingVertical: 4,
  },
  subtext: {
    color: "#6b7280",
    fontSize: 12,
  },
  value: {
    fontWeight: "600",
  },
  button: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  iconClose: {
    opacity: 1,
  },
  iconCloseDisabled: {
    opacity: 0.5,
  },
});