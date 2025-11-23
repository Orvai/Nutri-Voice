import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { typography } from "../styles/typography";
import { radii } from "../styles/dimens";
import { shadows } from "../styles/shadows";

const AVATAR_PLACEHOLDER =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80";
const userProfile = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    status: "Premium Member",
    profileImageUrl: AVATAR_PLACEHOLDER,
};

export default function Settings() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.replace("/(app)/home")}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>

                    <View style={styles.headerText}>
                        <Text style={styles.title}>Settings</Text>
                        <Text style={styles.subtitle}>Manage your account and preferences</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.profileCard}
                    activeOpacity={0.85}
                    onPress={() => router.push("/(app)/profile")}>
                    <Image
                        source={{ uri: userProfile.profileImageUrl || AVATAR_PLACEHOLDER }}
                        style={styles.profileAvatar}
                    />

                    <View style={styles.profileText}>
                        <Text style={styles.profileName}>{userProfile.name}</Text>
                        <Text style={styles.profileEmail}>{userProfile.email}</Text>
                        <Text style={styles.profileTag}>{userProfile.status}</Text>
                    </View>

                    <View style={styles.profileChevron}>
                        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                    </View>
                </TouchableOpacity>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity
                        style={styles.settingRow}
                        activeOpacity={0.85}
                        onPress={() => router.push("/(app)/profile")}>
                        <View style={styles.settingIconWrapper}>
                            <Ionicons
                                name="person-circle-outline"
                                size={22}
                                color={colors.accentAlt}
                            />
                        </View>

                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>Personal Profile</Text>
                            <Text style={styles.settingSubtitle}>Update your personal information</Text>
                        </View>

                        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: spacing.enormous * 2,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.enormous,
        paddingBottom: spacing.enormous * 2,
        gap: spacing.enormous,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xxl,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: radii.lg,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.borderMuted,
        ...shadows.subtle,
    },
    headerText: {
        flex: 1,
        gap: spacing.xs,
    },
    title: {
        ...typography.heading,
    },
    subtitle: {
        ...typography.subtitle,
        color: colors.textMuted,
    },
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: radii.xxl,
        padding: spacing.enormous,
        borderWidth: 1,
        borderColor: colors.borderMuted,
        gap: spacing.enormous,
        ...shadows.medium,
    },
    profileAvatar: {
        width: 56,
        height: 56,
        borderRadius: radii.full,
    },
    profileText: {
        flex: 1,
        gap: spacing.xs,
    },
    profileName: {
        ...typography.label,
    },
    profileEmail: {
        ...typography.helper,
    },
    profileTag: {
        ...typography.helper,
        color: colors.success,
        fontWeight: "600",
    },
    profileChevron: {
        width: 36,
        height: 36,
        borderRadius: radii.lg,
        backgroundColor: colors.borderMuted,
        alignItems: "center",
        justifyContent: "center",
    },
    section: {
        gap: spacing.md,
    },
    sectionTitle: {
        ...typography.helper,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    settingRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: radii.xxl,
        padding: spacing.enormous,
        borderWidth: 1,
        borderColor: colors.borderMuted,
        gap: spacing.enormous,
    },
    settingIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: radii.xxl,
        backgroundColor: colors.highlight,
        alignItems: "center",
        justifyContent: "center",
    },
    settingText: {
        flex: 1,
        gap: spacing.xs,
    },
    settingTitle: {
        ...typography.label,
    },
    settingSubtitle: {
        ...typography.helper,
        color: colors.textSecondary,
    },
});
