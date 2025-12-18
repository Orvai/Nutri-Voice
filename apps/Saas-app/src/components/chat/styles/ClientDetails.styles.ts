import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    padding: 20,
    flexDirection: "column",
    gap: 20,
  },
  profileRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right",
  },
  status: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "right",
  },
  infoList: {
    gap: 6,
  },
  infoText: {
    textAlign: "right",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});