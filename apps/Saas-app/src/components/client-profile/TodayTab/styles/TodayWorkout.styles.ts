import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row-reverse",
    gap: 10,
    marginBottom: 12,
  },
  iconBox: {
    backgroundColor: "#eff6ff",
    padding: 10,
    borderRadius: 12,
  },
  muted: {
    color: colors.neutral500,
    fontSize: 12,
  },
  boxesRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 12,
  },
  box: {
    backgroundColor: colors.neutral50,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
});