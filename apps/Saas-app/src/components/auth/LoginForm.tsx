import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";

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
    <View style={{ width: "100%", maxWidth: 380 }}>

      <Text style={{ fontWeight: "600", textAlign: "right" }}>אימייל</Text>
      <View style={{ position: "relative", marginBottom: 16 }}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#6b7280"
          style={{ position: "absolute", right: 12, top: 14 }}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="name@company.com"
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            paddingVertical: 14,
            paddingRight: 40,
            paddingLeft: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            fontSize: 16,
          }}
        />
      </View>

      <Text style={{ fontWeight: "600", textAlign: "right" }}>סיסמה</Text>
      <View style={{ position: "relative", marginBottom: 6 }}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#6b7280"
          style={{ position: "absolute", right: 12, top: 14 }}
        />
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="•••••••••"
          style={{
            paddingVertical: 14,
            paddingRight: 40,
            paddingLeft: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            fontSize: 16,
          }}
        />
      </View>

      {error ? (
        <Text style={{ color: "red", marginBottom: 10, textAlign: "right" }}>
          {error}
        </Text>
      ) : null}

      <Pressable style={{ marginBottom: 16 }}>
        <Text style={{ color: "#2563eb", textAlign: "left" }}>שכחת סיסמה?</Text>
      </Pressable>

      <Pressable
        onPress={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#93c5fd" : "#2563eb",
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            התחבר
          </Text>
        )}
      </Pressable>
    </View>
  );
}
