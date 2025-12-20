import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "right",
    color: colors.neutral800,
  },
  subtitle: {
    fontSize: 12,
    color: colors.neutral500,
    textAlign: "right",
    marginTop: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "800",
    color: colors.primary,
  },
  notes: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 14,
    padding: 12,
    backgroundColor: colors.white,
    textAlign: "right",
    marginBottom: 12,
    minHeight: 46,
  },
  footer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "600",
  },
});