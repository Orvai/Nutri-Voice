import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
  },

  accent: {
    width: 6,
  },

  content: {
    padding: 14,
    flex: 1,
    gap: 10,
  },

  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  headerText: {
    flex: 1,
    alignItems: "flex-end",
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "right",
  },

  subtitle: {
    fontSize: 12,
    textAlign: "right",
  },

  metaRow: {
    flexDirection: "row-reverse",
    gap: 12,
    flexWrap: "wrap",
  },

  metaText: {
    fontSize: 12,
    textAlign: "right",
  },
});
