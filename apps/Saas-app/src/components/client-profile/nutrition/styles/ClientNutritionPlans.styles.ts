import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  errorContainer: {
    padding: 20,
  },

  errorText: {
    color: "red",
  },

  emptyContainer: {
    padding: 20,
    gap: 12,
  },

  emptyText: {
    color: colors.neutral800,
    fontSize: 15,
    fontWeight: "600",
  },

  emptySubText: {
    color: colors.neutral600,
    fontSize: 13,
  },

  loadTemplatesButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 190,
    alignItems: "center",
    justifyContent: "center",
  },

  loadTemplatesButtonPressed: {
    opacity: 0.82,
  },

  loadTemplatesButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },

  scroll: {
    flex: 1,
    backgroundColor: colors.neutral100,
  },

  scrollContent: {
    padding: 20,
  },

  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  weekSummaryCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 6,
  },

  weekSummaryRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },

  weekSummaryLabel: {
    color: colors.neutral800,
    fontWeight: "600",
    fontSize: 14,
  },

  weekSummaryValue: {
    minWidth: 74,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#fdba74",
    backgroundColor: "#fff7ed",
    color: "#9a3412",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontWeight: "700",
  },

  weekSummaryUnit: {
    color: "#9a3412",
    fontWeight: "700",
  },

  weekDaysText: {
    textAlign: "right",
    fontSize: 12,
    fontWeight: "600",
  },

  weekDaysOk: {
    color: "#166534",
  },

  weekDaysWarning: {
    color: "#b45309",
  },

  badge: {
    backgroundColor: colors.neutral200,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    opacity: 0.8,
  },

  badgeText: {
    color: colors.neutral700,
    fontWeight: "700",
    fontSize: 13,
  },

  loaderContainer: {
    padding: 20,
  },
});
