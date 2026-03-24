import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { InputField } from "@/components/ui/InputField";
import { NeonButton } from "@/components/ui/NeonButton";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type ForgotPasswordFormProps = {
  onSubmit: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
};

export function ForgotPasswordForm({
  onSubmit,
  loading,
  error,
  successMessage
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("alex@nutri.app");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setValidationError(null);

    if (!email.trim()) {
      setValidationError("צריך להזין כתובת אימייל");
      return;
    }

    await onSubmit(email.trim());
  };

  return (
    <View style={styles.container}>
      <InputField
        label="אימייל לשחזור"
        value={email}
        onChangeText={setEmail}
        placeholder="name@example.com"
        keyboardType="email-address"
      />

      {validationError ? <Text style={styles.error}>{validationError}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

      <NeonButton label="שלח קישור" onPress={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md
  },
  error: {
    color: colors.danger,
    textAlign: "right",
    fontSize: 13
  },
  success: {
    color: colors.success,
    textAlign: "right",
    fontSize: 13
  }
});
