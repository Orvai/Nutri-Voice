import { colors } from "./colors";

export const typography = {
    title: {
        fontSize: 30,
        fontWeight: "700" as const,
        color: colors.textPrimary,
    },
    heading: {
        fontSize: 24,
        fontWeight: "800" as const,
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    label: {
        fontSize: 14,
        fontWeight: "600" as const,
        color: colors.textPrimary,
    },
    body: {
        fontSize: 14,
        color: colors.textPrimary,
    },
    helper: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    button: {
        fontSize: 16,
        fontWeight: "700" as const,
        color: colors.white,
    },
};