import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    gap: 10,
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
    justifyContent: "flex-start",
    marginTop: 6,
    alignItems: "center",
    gap: 10,
  },

  videoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#2563eb",
  },

  videoBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  noVideoText: {
    fontSize: 12,
    textAlign: "right",
  },

  uploaderWrap: {
    marginTop: 8,
  },
});
