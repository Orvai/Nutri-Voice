import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { radii } from "./dimens";
import { spacing } from "./spacing";
import { shadows } from "./shadows";
import { typography } from "./typography";

export const globalStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentPadding: {
        paddingHorizontal: spacing.enormous,
        paddingTop: spacing.enormous,
        paddingBottom: spacing.enormous,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: radii.xl,
        padding: spacing.xxl,
        ...shadows.medium,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radii.md,
        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.xxl,
        backgroundColor: colors.white,
    },
    input: {
        flex: 1,
        marginLeft: spacing.lg,
        fontSize: typography.button.fontSize,
        color: colors.textPrimary,
    },
    tooltip: {
        backgroundColor: colors.tooltipBg,
        paddingVertical: spacing.xxxl,
        paddingHorizontal: spacing.xxl,
        borderRadius: radii.sm,
        borderWidth: 1,
        borderColor: colors.tooltipBorder,
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: spacing.giant,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        marginHorizontal: spacing.xxl,
        color: colors.textMuted,
        fontWeight: "500",
    },
    pill: {
        borderRadius: radii.full,
        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.tooltipBg,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.lg,
    },
});

export const gradientColors = [colors.accentAlt, colors.accentAlt2] as const;