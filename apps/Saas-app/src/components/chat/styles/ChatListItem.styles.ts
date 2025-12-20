import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    textAlign: "right",
  },
  lastMessage: {
    fontSize: 13,
    color: colors.neutral500,
    textAlign: "right",
    marginTop: 2,
  },
  badge: {
    minWidth: 24,
    height: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  badgeText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 12,
  },
});