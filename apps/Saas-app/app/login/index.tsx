import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import LoginLogo from "../../src/components/auth/LoginLogo";
import LoginHeader from "../../src/components/auth/LoginHeader";
import LoginForm from "../../src/components/auth/LoginForm";
import { useAuth } from "../../src/context/AuthContext";

export default function LoginScreen() {
  const { user, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(dashboard)/dashboard" />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <LoginLogo />
      <LoginHeader />
      <LoginForm />
    </View>
  );
}
