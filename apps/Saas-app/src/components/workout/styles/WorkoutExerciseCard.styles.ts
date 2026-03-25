import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  card: {
    gap: 8,
  },

  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "800",
    fontSize: 14,
    textAlign: "right",
  },

  actionsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  mediaSection: {
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
  },

  videoBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },

  videoBtnText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 11,
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
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 10,
    backgroundColor: "#fee2e2",
  },

  deleteVideoBtnText: {
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: 11,
  },
});
