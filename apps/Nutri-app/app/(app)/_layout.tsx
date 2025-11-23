import React from "react";
import { Stack } from "expo-router";

export default function AppLayoutStack() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" />
            <Stack.Screen name="settings" />

        </Stack>
    );
}