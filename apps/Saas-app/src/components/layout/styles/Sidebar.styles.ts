import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: 240,
    backgroundColor: "#ffffff",
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
    paddingTop: 40,
  },
  title: {
    textAlign: "right",
    fontSize: 22,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuContainer: {
    gap: 8,
  },
  button: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  buttonActive: {
    backgroundColor: "#2563eb",
  },
  icon: {
    marginLeft: 12,
  },
  text: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  textActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  logoutButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: "auto",
  },
  logoutIcon: {
    marginLeft: 12,
  },
  logoutText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "600",
  },
});