import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 12,
    borderBottomColor: "#f1f5f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  button: {
    backgroundColor: "#eef2ff",
    borderColor: "#c7d2fe",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  buttonText: {
    color: "#4338ca",
    fontWeight: "700",
  },
  caloriesContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  caloriesLabel: {
    fontSize: 14,
  },
  caloriesValue: {
    minWidth: 70,
    textAlign: "center",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontWeight: "600",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  caloriesUnit: {
    fontWeight: "600",
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
  modalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  modalCloseText: {
    color: "#ef4444",
    fontWeight: "700",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
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
});