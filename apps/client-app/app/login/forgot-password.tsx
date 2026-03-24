import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { AuthScaffold } from "@/components/auth/AuthScaffold";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { NeonButton } from "@/components/ui/NeonButton";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

export default function ForgotPasswordScreen() {
  const { submitReset, loading, error, message } = useForgotPassword();

  return (
    <Screen scroll={false} contentContainerStyle={{ flex: 1, justifyContent: "center", gap: 20 }}>
      <AuthScaffold
        title="איפוס סיסמה"
        subtitle="נשלח קישור לאימייל שלך כדי לאפס את הסיסמה"
      >
        <ForgotPasswordForm
          loading={loading}
          error={error}
          successMessage={message}
          onSubmit={async (email) => {
            await submitReset({ email });
          }}
        />
      </AuthScaffold>

      <NeonButton label="חזרה להתחברות" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}
