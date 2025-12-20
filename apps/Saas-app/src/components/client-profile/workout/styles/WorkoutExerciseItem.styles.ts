import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.neutral800,
    textAlign: "right",
  },
  muscle: {
    fontSize: 11,
    color: colors.neutral500,
    textAlign: "right",
    marginTop: 2,
  },
  stats: {
    alignItems: "flex-end",
    gap: 2,
  },
  statText: {
    fontSize: 11,
    color: colors.neutral700,
  },
  strong: {
    fontWeight: "700",
  },
  remove: {
    marginTop: 6,
    alignSelf: "flex-end",
  },
  removeText: {
    color: colors.danger,
    fontSize: 11,
  },
});