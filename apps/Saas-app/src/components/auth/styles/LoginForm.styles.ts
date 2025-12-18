import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 380,
  },
  labelText: {
    fontWeight: "600",
    textAlign: "right",
  },
  inputContainer: {
    position: "relative",
    marginBottom: 16,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 6,
  },
  icon: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  input: {
    paddingVertical: 14,
    paddingRight: 40,
    paddingLeft: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "right",
  },
  forgotPassword: {
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: "#2563eb",
    textAlign: "left",
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});