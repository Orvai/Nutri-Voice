import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  list: {
    gap: 10,
  },

  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },

  cardSelected: {
    borderColor: "#22c55e",
    backgroundColor: "#dcfce7",
  },

  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 8,
  },

  title: {
    fontWeight: "700",
    fontSize: 16,
    textAlign: "right",
    flex: 1,
  },

  subtitle: {
    textAlign: "right",
  },

  tagsRow: {
    flexDirection: "row-reverse",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 6,
  },

  skeletonContainer: {
    gap: 10,
  },

  skeleton: {
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.neutral200,
  },
});