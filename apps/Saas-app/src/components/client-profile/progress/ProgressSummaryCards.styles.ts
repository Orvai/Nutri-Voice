import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
    backgroundColor: "#e5e7eb",
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
