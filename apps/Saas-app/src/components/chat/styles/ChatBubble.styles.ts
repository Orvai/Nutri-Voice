import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
  },
  incomingContainer: {
    justifyContent: "flex-start",
  },
  outgoingContainer: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "78%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  outgoingBubble: {
    backgroundColor: "#22c55e",
    borderTopRightRadius: 6,
  },
  aiOutgoingBubble: {
    backgroundColor: "#16a34a",
  },
  incomingBubble: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: "right",
  },
  outgoingMessageText: {
    color: "#f0fdf4",
  },
  incomingMessageText: {
    color: "#111827",
  },
  timeText: {
    marginTop: 6,
    fontSize: 11,
    textAlign: "right",
  },
  outgoingTimeText: {
    color: "#dcfce7",
  },
  incomingTimeText: {
    color: "#6b7280",
  },
  botLabel: {
    color: "#dcfce7",
    textAlign: "right",
    fontWeight: "700",
    fontSize: 11,
    marginBottom: 4,
  },
});
