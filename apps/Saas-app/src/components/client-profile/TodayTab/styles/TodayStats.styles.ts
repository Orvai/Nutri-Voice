import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral200,
    marginBottom: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.neutral800,
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: colors.neutral50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  rowLeft: {
    flexDirection: "row-reverse",
    gap: 10,
    alignItems: "center",
  },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dbeafe",
  },
  label: {
    color: colors.neutral700,
    fontSize: 13,
    fontWeight: "700",
  },
  value: {
    fontWeight: "900",
    color: colors.neutral800,
    fontSize: 14,
  },
  valueMissing: {
    color: colors.neutral500,
    fontWeight: "700",
    fontSize: 12,
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.neutral50,
  },
  emptyText: {
    color: colors.neutral500,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
