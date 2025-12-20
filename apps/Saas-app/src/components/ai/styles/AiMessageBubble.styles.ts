import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    gap: 10,
    marginBottom: 24,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flex: 1,
  },
  messageContainer: {
    backgroundColor: "#eef2ff",
    padding: 14,
    borderRadius: 16,
    borderTopRightRadius: 0,
  },
  text: {
    color: "#1f2937",
    fontSize: 15,
    lineHeight: 22,
  },
  timeText: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 6,
  },
});