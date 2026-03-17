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
  header: {
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
  status: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: "800",
  },
  statusDone: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  statusPending: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  devTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1d4ed8",
    textAlign: "right",
    marginBottom: 8,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 14,
    backgroundColor: "#fcfdff",
    marginTop: 10,
  },
  row: {
    flexDirection: "row-reverse",
    gap: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  iconBox: {
    backgroundColor: "#dbeafe",
    padding: 10,
    borderRadius: 12,
  },
  workoutTitle: {
    fontWeight: "800",
    color: colors.neutral800,
    fontSize: 15,
  },
  muted: {
    color: colors.neutral500,
    fontSize: 12,
  },
  infoChips: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  infoChip: {
    backgroundColor: colors.neutral100,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  infoChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.neutral700,
  },

  effortEasy: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.28)",
  },
  effortNormal: {
    backgroundColor: "rgba(37,99,235,0.12)",
    borderColor: "rgba(37,99,235,0.28)",
  },
  effortHard: {
    backgroundColor: "rgba(245,158,11,0.16)",
    borderColor: "rgba(245,158,11,0.34)",
  },
  effortFailed: {
    backgroundColor: "rgba(239,68,68,0.16)",
    borderColor: "rgba(239,68,68,0.34)",
  },
  effortSkipped: {
    backgroundColor: "rgba(71,85,105,0.16)",
    borderColor: "rgba(71,85,105,0.34)",
  },
  notes: {
    fontSize: 12,
    color: colors.neutral700,
    textAlign: "right",
    marginBottom: 10,
  },
  exercisesWrap: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  exerciseRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  exerciseName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.neutral800,
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
  exerciseValue: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.neutral600,
  },
  exerciseEmpty: {
    fontSize: 12,
    color: colors.neutral500,
    textAlign: "right",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  emptyCard: {
    backgroundColor: colors.neutral100,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 14,
    borderRadius: 10,
  },
  emptyText: {
    textAlign: "right",
    color: colors.neutral600,
    fontSize: 13,
    fontWeight: "700",
  },
});
