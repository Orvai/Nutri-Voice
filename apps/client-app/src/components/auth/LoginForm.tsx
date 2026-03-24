import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { InputField } from "@/components/ui/InputField";
import { NeonButton } from "@/components/ui/NeonButton";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
  onForgotPassword: () => void;
  loading: boolean;
  error: string | null;
};

export function LoginForm({
  onSubmit,
  onForgotPassword,
  loading,
  error
}: LoginFormProps) {
  const [email, setEmail] = useState("alex@nutri.app");
  const [password, setPassword] = useState("12345678");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setValidationError(null);

    if (!email.trim() || !password.trim()) {
      setValidationError("יש להזין אימייל וסיסמה");
      return;
    }

    await onSubmit(email.trim(), password);
  };

  return (
    <View style={styles.container}>
      <InputField
        label="אימייל"
        value={email}
        onChangeText={setEmail}
        placeholder="name@example.com"
        keyboardType="email-address"
      />

      <InputField
        label="סיסמה"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
      />

      {validationError ? <Text style={styles.error}>{validationError}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable onPress={onForgotPassword}>
        <Text style={styles.forgotPassword}>שכחת סיסמה?</Text>
      </Pressable>

      <NeonButton label="התחבר" loading={loading} onPress={handleSubmit} />
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
  forgotPassword: {
    color: colors.neon,
    fontSize: 14,
    textAlign: "right",
    fontWeight: "600"
  }
});
