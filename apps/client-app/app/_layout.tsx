import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { I18nManager } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/auth/AuthContext";
import { colors } from "@/constants/colors";

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background }
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login/index" />
            <Stack.Screen name="login/forgot-password" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="workout/[id]/index" />
            <Stack.Screen name="workout/active/[id]" />
            <Stack.Screen name="workout/summary/[id]" />
            <Stack.Screen name="nutrition/meal/[mealId]/index" />
            <Stack.Screen name="nutrition/report/index" />
            <Stack.Screen name="messages/index" />
          </Stack>
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
