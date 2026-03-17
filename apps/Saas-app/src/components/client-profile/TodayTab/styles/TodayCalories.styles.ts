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
  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.neutral800,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusGood: {
    backgroundColor: "#dcfce7",
  },
  statusWarning: {
    backgroundColor: "#fef3c7",
  },
  statusDanger: {
    backgroundColor: "#fee2e2",
  },
  valueRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.neutral50,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  valueBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  valueLabel: {
    fontSize: 12,
    color: colors.neutral500,
    fontWeight: "700",
    marginBottom: 3,
  },
  valueDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.neutral200,
  },
  mainValue: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.neutral800,
  },
  targetValue: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.neutral700,
  },
  progressTrack: {
    marginTop: 12,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.neutral100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  fillGood: { backgroundColor: "#16a34a" },
  fillWarning: { backgroundColor: "#d97706" },
  fillDanger: { backgroundColor: "#dc2626" },
  balanceText: {
    marginTop: 8,
    color: colors.neutral600,
    fontSize: 12,
    textAlign: "right",
    writingDirection: "rtl",
    fontWeight: "700",
  },
  macrosGrid: {
    gap: 10,
    marginTop: 14,
  },
  footer: {
    marginTop: 14,
    fontSize: 12,
    color: colors.neutral500,
    textAlign: "right",
    writingDirection: "rtl",
  },
  macroRow: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.neutral50,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  macroHead: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
  },
  macroLabel: {
    color: colors.neutral700,
    fontWeight: "800",
    fontSize: 13,
  },
  macroValue: {
    color: colors.neutral500,
    fontWeight: "700",
    fontSize: 12,
  },
  macroTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.neutral200,
    overflow: "hidden",
  },
  macroFill: {
    height: "100%",
    borderRadius: 999,
  },
});
