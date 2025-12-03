import { Stack } from "expo-router";
import { I18nManager } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AuthProvider } from "../src/context/AuthContext"; 

export default function RootLayout() {
  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  return (
    <AuthProvider> {/* 👈 עטפנו את כל האפליקציה בהקשר של auth */}
      <SafeAreaProvider>
        <StatusBar style="dark" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#f9fafb" },
          }}
        >
          {/* מסך לוגין */}
          <Stack.Screen name="login/index" />

          {/* קבוצת הדשבורד */}
          <Stack.Screen name="(dashboard)" />

          {/* index הרגיל */}
          <Stack.Screen name="index" />
        </Stack>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
