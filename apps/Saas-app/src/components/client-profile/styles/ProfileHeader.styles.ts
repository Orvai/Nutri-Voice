import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderColor: colors.neutral200,
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
  },
  info: {
    alignItems: "flex-end",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
  },
  muted: {
    color: colors.neutral500,
    fontSize: 14,
  },
  action: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  actionText: {
    fontSize: 14,
    color: colors.white,
  },
  actionIcon: {
    marginLeft: 6,
  },
});