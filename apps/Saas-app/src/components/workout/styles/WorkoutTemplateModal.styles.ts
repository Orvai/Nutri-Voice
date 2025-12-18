import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
    padding: 14,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    maxHeight: "92%",
  },

  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  title: {
    fontWeight: "900",
    fontSize: 16,
    textAlign: "right",
  },

  close: {
    fontSize: 18,
    fontWeight: "900",
  },
});
