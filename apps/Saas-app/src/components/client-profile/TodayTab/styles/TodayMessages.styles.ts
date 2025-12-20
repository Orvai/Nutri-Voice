import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  message: {
    paddingBottom: 10,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: colors.neutral100,
  },
  row: {
    flexDirection: "row-reverse",
    gap: 10,
    marginBottom: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  text: {
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: colors.neutral500,
  },
  actionsRow: {
    flexDirection: "row-reverse",
    gap: 8,
  },
  actionPrimary: {
    backgroundColor: "#eff6ff",
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  actionSecondary: {
    backgroundColor: colors.neutral100,
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  actionPrimaryText: {
    color: colors.primary,
    fontSize: 12,
  },
  actionSecondaryText: {
    color: colors.neutral700,
    fontSize: 12,
  },
  footer: {
    marginTop: 10,
    alignItems: "center",
  },
  footerText: {
    color: colors.primary,
    fontWeight: "600",
  },
});