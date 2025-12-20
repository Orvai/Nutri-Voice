import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.neutral200,
    padding: 20,
    flexDirection: "column",
    gap: 20,
  },
  profileRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right",
  },
  status: {
    fontSize: 13,
    color: colors.neutral500,
    textAlign: "right",
  },
  infoList: {
    gap: 6,
  },
  infoText: {
    textAlign: "right",
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.white,
    textAlign: "center",
    fontWeight: "700",
  },
});