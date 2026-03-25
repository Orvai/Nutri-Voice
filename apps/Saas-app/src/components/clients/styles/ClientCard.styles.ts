import { colors } from "src/styles/colors";

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    shadowColor: colors.black,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 50,
  },
  infoContainer: {
    flex: 1,
  },
  statusRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  statusDotActive: {
    backgroundColor: colors.success,
  },
  statusDotInactive: {
    backgroundColor: colors.danger,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
  },
  statusTextActive: {
    color: colors.success,
  },
  statusTextInactive: {
    color: colors.danger,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.neutral800,
    textAlign: "right",
  },
  phone: {
    fontSize: 13,
    color: colors.neutral500,
    marginTop: 4,
    textAlign: "right",
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: "row-reverse",
    gap: 8,
  },
  actionButton: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },
  deactivateButton: {
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
  },
  deactivateButtonText: {
    color: "#b91c1c",
  },
  reactivateButton: {
    borderColor: "#bbf7d0",
    backgroundColor: "#f0fdf4",
  },
  reactivateButtonText: {
    color: "#166534",
  },
  editButton: {
    borderColor: "#bfdbfe",
    backgroundColor: "#eff6ff",
  },
  editButtonText: {
    color: "#1d4ed8",
  },
  viewText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
});
