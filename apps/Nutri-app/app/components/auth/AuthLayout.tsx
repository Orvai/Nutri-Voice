// components/auth/AuthLayout.tsx
import React from "react";
import {View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions,} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { radii } from "../../styles/dimens";
import { typography } from "../../styles/typography";
import { shadows } from "../../styles/shadows";
import BackButton from "../common/BackButton";

type AuthLayoutProps = {
    title: string;
    subtitle: string;
    showBack?: boolean;
    onBackPress?: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
    headerContent?: React.ReactNode;
    showLogo?: boolean;
};

const { height } = Dimensions.get("window");
const IS_SMALL_SCREEN = height < 700;
const MAX_CONTENT_WIDTH = 520;

export default function AuthLayout({title, subtitle, showBack = false, onBackPress, children, footer, headerContent, showLogo = true,}: AuthLayoutProps) {
    return (
        <View style={styles.root}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    <View style={styles.inner}>
                        {showBack && (
                            <View style={styles.backWrapper}>
                                <BackButton onPress={onBackPress || (() => {})} />
                            </View>
                        )}

                        {headerContent && (
                            <View style={styles.headerWrapper}>{headerContent}</View>
                        )}

                        {showLogo && (
                            <View style={styles.logoWrapper}>
                                <LinearGradient
                                    colors={[colors.accentAlt, colors.accentAlt2]}
                                    style={styles.logo}
                                >
                                    <Ionicons name="flash" size={32} color={colors.white} />
                                </LinearGradient>
                            </View>
                        )}

                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>{subtitle}</Text>

                        <View style={styles.body}>{children}</View>

                        {footer && <View style={styles.footer}>{footer}</View>}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboard: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        paddingTop: IS_SMALL_SCREEN ? spacing.lg : spacing.xxl,
        paddingBottom: IS_SMALL_SCREEN ? spacing.xl : spacing.enormous,
    },
    inner: {
        width: "100%",
        maxWidth: MAX_CONTENT_WIDTH,
        alignSelf: "center",
        flexGrow: 1,
    },
    backWrapper: {
        width: "100%",
        marginBottom: spacing.md,
    },
    headerWrapper: {
        width: "100%",
        marginBottom: spacing.lg,
    },
    logoWrapper: {
        alignItems: "center",
        marginTop: IS_SMALL_SCREEN ? spacing.md : spacing.xl,
        marginBottom: IS_SMALL_SCREEN ? spacing.lg : spacing.xl,
    },
    logo: {
        width: IS_SMALL_SCREEN ? 56 : 80,
        height: IS_SMALL_SCREEN ? 56 : 80,
        borderRadius: radii.xl,
        justifyContent: "center",
        alignItems: "center",
        ...shadows.medium,
    },
    title: {
        ...typography.title,
        textAlign: "center",
        marginTop: spacing.lg,
    },
    subtitle: {
        ...typography.subtitle,
        textAlign: "center",
        marginTop: spacing.sm,
        marginBottom: IS_SMALL_SCREEN ? spacing.xl : spacing.xxxl,
    },
    body: {
        flexGrow: 1,
        width: "100%",
        gap: spacing.lg,
    },
    footer: {
        marginTop: spacing.xl,
        alignItems: "center",
        width: "100%",
    },
});

