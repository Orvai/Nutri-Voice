import { Redirect, router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { AuthScaffold } from "@/components/auth/AuthScaffold";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useLogin } from "@/hooks/auth/useLogin";

export default function LoginScreen() {
  const { user, isHydrated } = useAuthSession();
  const { login, loading, error } = useLogin();

  if (!isHydrated) {
    return (
      <Screen scroll={false} contentContainerStyle={{ flex: 1, justifyContent: "center" }}>
        <AuthScaffold title="Nutri Voice" subtitle="טוען..." />
      </Screen>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Screen scroll={false} contentContainerStyle={{ flex: 1, justifyContent: "center" }}>
      <AuthScaffold
        title="Nutri Voice"
        subtitle="האפליקציה האישית שלך למעקב תזונה ואימון עם ליווי מאמן"
      >
        <LoginForm
          loading={loading}
          error={error}
          onSubmit={async (email, password) => {
            const result = await login({ email, password });
            if (result) {
              router.replace("/(tabs)/home");
            }
          }}
          onForgotPassword={() => router.push("/login/forgot-password")}
        />
      </AuthScaffold>
    </Screen>
  );
}
