import { colors } from "src/styles/colors";
+40
-0

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    shadowColor: colors.black,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 50,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.neutral800,
    textAlign: "right",
  },
  phone: {
    fontSize: 13,
    color: colors.neutral500,
    marginTop: 4,
    textAlign: "right",
  },
  viewText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
});