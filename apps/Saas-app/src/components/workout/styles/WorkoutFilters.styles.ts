import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },

  filtersWrap: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
  },

  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  filterText: {
    fontSize: 12,
  },

  countText: {
    fontSize: 12,
    color: "#6b7280",
  },
});
