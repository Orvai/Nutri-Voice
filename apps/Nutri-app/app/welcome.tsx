import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const featureItems = [
    { icon: "shield-checkmark" as const, label: "Smart Threat Detection" },
    { icon: "time-outline" as const, label: "Real-time Protection" },
    { icon: "analytics-outline" as const, label: "Advanced Analytics" },
];

export default function Welcome() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={["#2A1B69", "#101537", "#0A0C29"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <StatusBar style="light" />

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View style={styles.innerContent}>
                    {/* Logo Badge */}
                <LinearGradient
                    colors={["#8F53FF", "#5F4CFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconBadge}
                >
                    <Ionicons name="shield" size={30} color="#FFFFFF" />
                    <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                </LinearGradient>

                {/* Logo */}
                <Text style={styles.logoText}>cyrom.ai</Text>
                <Text style={styles.tagline}>
                    AI-Powered Personal Cyber & Fraud Assistant
                </Text>

                {/* Feature List */}
                <View style={styles.featureList}>
                    {featureItems.map((feature) => (
                        <View key={feature.label} style={styles.featureRow}>
                            <Ionicons name={feature.icon} size={18} color="#B6C7FF" />
                            <Text style={styles.featureLabel}>{feature.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Info Card */}
                <LinearGradient
                    colors={["rgba(255,255,255,0.12)", "rgba(255,255,255,0.06)"]}
                    style={styles.infoCard}
                >
                    <View style={styles.infoIconWrapper}>
                        <MaterialCommunityIcons
                            name="shield-account-outline"
                            size={28}
                            color="#74A1FF"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.infoTitle}>AI-Powered Protection</Text>
                        <Text style={styles.infoText}>
                            Advanced machine learning algorithms to protect you from cyber
                            threats and fraud attempts in real-time.
                        </Text>
                    </View>
                </LinearGradient>

                {/* CTA */}
                <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() => router.push("/(auth)/login")}
                >
                    <LinearGradient
                        colors={["#745BFF", "#4BD4FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.ctaButton}
                    >
                        <Text style={styles.ctaText}>Get Started</Text>
                        <Ionicons name="arrow-forward" size={18} color="#00152E" />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Footer */}
                <View style={styles.footerRow}>
                    <View style={styles.footerItem}>
                        <Ionicons name="shield-checkmark" size={14} color="#A8B9FF" />
                        <Text style={styles.footerText}>Bank-level Security</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.footerItem}>
                        <Ionicons name="lock-closed" size={14} color="#A8B9FF" />
                        <Text style={styles.footerText}>End-to-end Encryption</Text>
                    </View>
                </View>

                <Text style={styles.versionText}>v2.1.0</Text>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
        alignItems: "center",
    },

    innerContent: {
        width: "100%",
        maxWidth: 520,
        alignItems: "center",
        alignSelf: "center",
    },

    iconBadge: {
        width: 84,
        height: 84,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#A580FF",
        shadowOpacity: 0.4,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        position: "relative",
    },

    checkBadge: {
        position: "absolute",
        bottom: -2,
        right: -2,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#24D96C",
        alignItems: "center",
        justifyContent: "center",
    },

    logoText: {
        marginTop: 20,
        fontSize: 36,
        fontWeight: "800",
        color: "#C9D6FF",
        letterSpacing: 1,
    },

    tagline: {
        marginTop: 6,
        fontSize: 14,
        color: "#D7E1FF",
        textAlign: "center",
        lineHeight: 22,
        width: "100%",
        maxWidth: 460,
    },

    featureList: {
        width: "100%",
        marginTop: 28,
        rowGap: 14,
        alignItems: "flex-start",
    },

    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    featureLabel: {
        color: "#E7EEFF",
        fontSize: 15,
        fontWeight: "600",
    },

    infoCard: {
        width: "100%",
        marginTop: 32,
        borderRadius: 20,
        padding: 20,
        flexDirection: "row",
        gap: 18,
        borderColor: "rgba(255,255,255,0.15)",
        borderWidth: 1,
    },

    infoIconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(139,122,255,0.20)",
    },

    infoTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 4,
    },

    infoText: {
        color: "#C9D4FF",
        fontSize: 14,
        lineHeight: 22,
    },

    buttonWrapper: {
        width: "100%",
        marginTop: 32,
    },

    ctaButton: {
        width: "100%",
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    ctaText: {
        fontSize: 17,
        fontWeight: "800",
        color: "#00152E",
    },

    footerRow: {
        flexDirection: "row",
        columnGap: 10,
        rowGap: 6,
        marginTop: 24,
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
    },

    footerItem: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
    },

    footerText: {
        color: "#A8B9FF",
        fontSize: 13,
        fontWeight: "600",
    },

    separator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#7784C8",
    },

    versionText: {
        marginTop: 12,
        color: "#8D9AE3",
        fontSize: 12,
        textAlign: "center",
        width: "100%",
    },
});
