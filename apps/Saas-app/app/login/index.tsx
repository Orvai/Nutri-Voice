import { View } from "react-native";
import LoginLogo from "../../src/components/auth/LoginLogo";
import LoginHeader from "../../src/components/auth/LoginHeader";
import LoginForm from "../../src/components/auth/LoginForm";

export default function LoginScreen() {
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
