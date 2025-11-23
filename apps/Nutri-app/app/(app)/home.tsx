import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { typography } from "../styles/typography";
import { radii } from "../styles/dimens";
import { shadows } from "../styles/shadows";
import { useRouter } from "expo-router";


const AVATAR_PLACEHOLDER = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80";

type UserProfile = {
    profileImageUrl?: string;
};

const mockUser: UserProfile = {
    profileImageUrl: AVATAR_PLACEHOLDER,
};

export default function Home() {
    const user = mockUser;
    const router = useRouter();


    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.titles}>
                    <Text style={styles.title}>Good morning!</Text>
                    <Text style={styles.subtitle}>Your security status overview</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.iconButton}
                        onPress={() => router.push("/(app)/settings")}>
                        <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>

                    <Image
                        source={{ uri: user.profileImageUrl || AVATAR_PLACEHOLDER }}
                        style={styles.avatar}
                    />
                </View>
            </View>

            <View style={styles.placeholderCard}>
                <Text style={styles.placeholderText}>Dashboard widgets coming soon.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.enormous,
        paddingTop: spacing.enormous * 2,
        paddingBottom: spacing.enormous,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.enormous,
    },
    titles: {
        flex: 1,
        paddingRight: spacing.enormous,
    },
    title: {
        ...typography.title,
    },
    subtitle: {
        ...typography.subtitle,
        marginTop: spacing.sm,
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
    },
    iconButton: {
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
    avatar: {
        width: 44,
        height: 44,
        borderRadius: radii.full,
        borderWidth: 2,
        borderColor: colors.white,
        backgroundColor: colors.borderMuted,
    },
    placeholderCard: {
        flex: 1,
        borderRadius: radii.xxl,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.borderMuted,
        alignItems: "center",
        justifyContent: "center",
    },
    placeholderText: {
        ...typography.body,
        color: colors.textSecondary,
    },
});