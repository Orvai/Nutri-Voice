// app/(auth)/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function AuthLayoutStack() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="register" />
            <Stack.Screen name="register-details" />
            <Stack.Screen name="register-user-info" />
            <Stack.Screen name="register-phone-verification" />
        </Stack>
    );
}
