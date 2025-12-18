import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useLogin } from "../../hooks/auth/useLogin";
import { styles } from "./styles/LoginForm.styles";

export default function LoginForm() {
  const { login, loading, error } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    if (!email || !password) return;

    const user = await login(email, password);

    if (user) {
      console.log("Logged in as:", user.firstName);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>אימייל</Text>
      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#6b7280"
          style={styles.icon}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="name@company.com"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <Text style={styles.labelText}>סיסמה</Text>
      <View style={styles.passwordContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#6b7280"
          style={styles.icon}
        />
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="•••••••••"
          style={styles.input}
        />
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      <Pressable style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>שכחת סיסמה?</Text>
      </Pressable>

      <Pressable
        onPress={handleSubmit}
        disabled={loading}
        style={[
          styles.submitButton,
          { backgroundColor: loading ? "#93c5fd" : "#2563eb" },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>התחבר</Text>
        )}
      </Pressable>
    </View>
  );
}