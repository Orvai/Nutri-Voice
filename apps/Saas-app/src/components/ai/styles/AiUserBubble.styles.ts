import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 24,
    gap: 10,
  },
  row: {
    maxWidth: "75%",
  },
  messageContainer: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 16,
    borderTopLeftRadius: 0,
  },
  text: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
  },
  timeText: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 6,
    textAlign: "left",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});