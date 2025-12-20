import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";
export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontWeight: "700",
    color: "#0f766e",
  },
  button: {
    flexDirection: "row-reverse",
    gap: 6,
    backgroundColor: "#cffafe",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: "#0f766e",
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#99f6e4",
    marginBottom: 10,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontWeight: "600",
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  removeIcon: {
    opacity: 1,
  },
  removeIconDisabled: {
    opacity: 0.4,
  },
  input: {
    backgroundColor: colors.neutral50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    textAlignVertical: "top",
    minHeight: 40,
  },
});