import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  card: {
    gap: 12,
  },

  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "800",
    fontSize: 15,
    textAlign: "right",
  },

  actionsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  mediaSection: {
    gap: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
  },

  videoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },

  videoBtnText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 13,
  },

  noVideoText: {
    fontSize: 11,
    textAlign: "right",
    fontWeight: "600",
  },

  noVideoBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.neutral100,
  },

  deleteVideoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#fee2e2",
  },

  deleteVideoBtnText: {
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: 12,
  },
});
