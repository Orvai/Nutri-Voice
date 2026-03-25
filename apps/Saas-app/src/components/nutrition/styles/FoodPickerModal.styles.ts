import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    maxHeight: "85%",
    gap: 12,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "800",
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: "right",
  },
  addNewButton: {
    alignSelf: "flex-end",
    backgroundColor: "#ecfeff",
    borderColor: "#99f6e4",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addNewButtonText: {
    color: "#0f766e",
    fontWeight: "700",
    textAlign: "right",
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  filtersBar: {
    flexGrow: 0,
    flexShrink: 0,
    minHeight: 44,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
  },
  list: {
    flex: 1,
    minHeight: 140,
  },
  quickCreateCard: {
    borderWidth: 1,
    borderColor: "#bae6fd",
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    gap: 2,
  },
  quickCreateTitle: {
    color: "#075985",
    fontWeight: "700",
    textAlign: "right",
  },
  quickCreateSubtitle: {
    color: "#0369a1",
    textAlign: "right",
    fontSize: 12,
  },
  buttonActive: {
    backgroundColor: "#0f766e",
    borderColor: "#0f766e",
  },
  buttonInactive: {
    backgroundColor: "#f1f5f9",
    borderColor: colors.neutral200,
  },
  text: {
    color: "#0f172a",
  },
  textActive: {
    color: "white",
  },
  textInactive: {
    color: "#0f172a",
  },
  message: {
    textAlign: "center",
    color: colors.neutral500,
    padding: 10,
  },
  errorText: {
    color: "#b91c1c",
    textAlign: "right",
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: "#0f766e",
    borderRadius: 12,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "700",
  },
});
