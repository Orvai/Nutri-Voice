import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
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
    color: colors.success,
  },
});