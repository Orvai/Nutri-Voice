import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    borderBottomWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 14,
    marginLeft: 20,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderColor: colors.primary,
  },
  labelActive: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  labelInactive: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.neutral500,
  },
});