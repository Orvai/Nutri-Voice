import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: colors.white,
    borderLeftWidth: 1,
    borderLeftColor: colors.neutral200,
    paddingTop: 12,
  },
  filterRow: {
    paddingHorizontal: 10,
    flexDirection: "row-reverse",
    gap: 6,
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: "#eff6ff",
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.neutral700,
  },
  filterTextActive: {
    color: colors.primary,
  },
});
