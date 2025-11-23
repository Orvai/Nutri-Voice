import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { radii } from "../../styles/dimens";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";

interface StepHeaderProps {
    step: number;
    totalSteps: number;
    subtitle?: string;
}

export default function StepHeader({ step, totalSteps, subtitle }: StepHeaderProps) {
    const progress = Math.min(Math.max(step / totalSteps, 0), 1);

    return (
        <View style={styles.container}><View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
            </View>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.enormous,
    },
    stepText: {
        color: colors.textSecondary,
        fontWeight: "600",
        marginBottom: spacing.lg,
    },
    progressTrack: {
        height: 8,
        backgroundColor: colors.border,
        borderRadius: radii.md,
        overflow: "hidden",
        marginBottom: spacing.xxl,
    },
    progressFill: {
        height: "100%",
        backgroundColor: colors.accentAlt,
        borderRadius: radii.md,
    },
    subtitle: {
        ...typography.body,
        fontWeight: "700",
    },
});
