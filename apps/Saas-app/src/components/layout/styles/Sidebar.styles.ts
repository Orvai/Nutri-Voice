import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    width: 240,
    backgroundColor: colors.white,
    borderLeftWidth: 1,
    borderLeftColor: colors.neutral200,
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
    backgroundColor: colors.primary,
  },
  icon: {
    marginLeft: 12,
  },
  text: {
    color: colors.neutral700,
    fontSize: 16,
    fontWeight: "500",
  },
  textActive: {
    color: colors.white,
    fontWeight: "700",
  },
  logoutButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
    marginTop: "auto",
  },
  logoutIcon: {
    marginLeft: 12,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "600",
  },
});