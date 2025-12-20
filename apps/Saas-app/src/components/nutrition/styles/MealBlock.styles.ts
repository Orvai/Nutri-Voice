import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    marginBottom: 20,
    padding: 16,
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
  subtitle: {
    fontSize: 13,
    color: colors.neutral500,
  },
  row: {
    flexDirection: "row-reverse",
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 10,
    paddingHorizontal: 8,
    minWidth: 90,
    textAlign: "center",
    fontWeight: "600",
  },
  removeButton: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeText: {
    color: "#b91c1c",
    fontWeight: "700",
  },
  removeTextDisabled: {
    opacity: 0.5,
  },
  addButton: {
    backgroundColor: "#eef2ff",
    borderColor: "#c7d2fe",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  addButtonText: {
    color: "#4338ca",
    fontWeight: "700",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: "right",
  },
  modalSubmitButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 10,
  },
  modalSubmitText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
  },
  modalCancelText: {
    textAlign: "center",
    color: "#ef4444",
    fontWeight: "700",
  },
});