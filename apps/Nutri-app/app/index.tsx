// app/index.tsx
import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { hasCompletedAuth } from "../src/lib/authStorage";

export default function Index() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isReturningUser, setIsReturningUser] = useState(false);

    useEffect(() => {(async () => {
            const completedAuth = await hasCompletedAuth();
            setIsReturningUser(completedAuth);
            setIsCheckingAuth(false);
        })();}, []);
    if (isCheckingAuth) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#8D5CF6" />
            </View>
        );
    }
    return <Redirect href={isReturningUser ? "/(auth)/login" : "/welcome"} />;
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0A0D2B",
    },
});

