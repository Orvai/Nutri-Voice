+40
-0

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    shadowColor: "#000",
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 50,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    textAlign: "right",
  },
  phone: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "right",
  },
  viewText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563eb",
  },
});