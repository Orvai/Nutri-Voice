import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },

  modalCard: {
    padding: 16,
    gap: 12,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },

  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "800",
    fontSize: 16,
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },

  close: {
    fontSize: 18,
    fontWeight: "900",
  },

  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.black,
  },

  video: {
    width: "100%",
    height: "100%",
  },
});