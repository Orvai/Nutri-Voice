import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "48%",
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  value: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 4,
  },
  barWrapper: {
    marginTop: 8,
  },
  barBackground: {
    height: 6,
    backgroundColor: colors.neutral200,
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
  },
  percent: {
    marginTop: 4,
    textAlign: "left",
  },
});