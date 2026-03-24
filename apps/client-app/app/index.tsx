import { Redirect } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { StatusView } from "@/components/ui/StatusView";
import { useAuthSession } from "@/hooks/auth/useAuthSession";

export default function IndexScreen() {
  const { user, isHydrated } = useAuthSession();

  if (!isHydrated) {
    return (
      <Screen scroll={false} contentContainerStyle={{ flex: 1, justifyContent: "center" }}>
        <StatusView type="loading" title="טוען את האפליקציה" />
      </Screen>
    );
  }

  return <Redirect href={user ? "/(tabs)/home" : "/login"} />;
}
