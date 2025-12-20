import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },

  close: {
    marginBottom: 10,
  },

  closeText: {
    textAlign: "right",
    color: colors.primary,
    fontSize: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "right",
  },

  pickedCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.neutral50,
  },

  pickedName: {
    textAlign: "right",
    fontWeight: "800",
    color: colors.neutral800,
  },

  pickedMuscle: {
    textAlign: "right",
    color: colors.neutral500,
    marginTop: 2,
    fontSize: 12,
  },

  inputsRow: {
    flexDirection: "row-reverse",
    gap: 10,
  },

  inputBlock: {
    flex: 1,
  },

  label: {
    textAlign: "right",
    color: colors.neutral800,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: "right",
  },

  actions: {
    flexDirection: "row-reverse",
    gap: 10,
    marginTop: 8,
  },

  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
  },

  backButtonText: {
    color: colors.neutral800,
    fontWeight: "700",
  },

  confirmButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
  },

  confirmButtonText: {
    color: colors.white,
    fontWeight: "800",
  },
});