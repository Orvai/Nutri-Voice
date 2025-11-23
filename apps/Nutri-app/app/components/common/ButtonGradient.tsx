import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { gradientColors } from "../../styles/globalStyles";
import { radii } from "../../styles/dimens";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";

interface ButtonGradientProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
}

const ButtonGradient: React.FC<ButtonGradientProps> = ({ title, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.buttonWrapper, style]}>
        <LinearGradient colors={gradientColors} style={styles.gradient}>
            <Text style={styles.text}>{title}</Text>
        </LinearGradient>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    buttonWrapper: {
        width: "100%",
        alignSelf: "stretch",
        flexGrow: 1,
        marginTop: spacing.lg,
    },
    gradient: {
        width: "100%",
        paddingVertical: spacing.enormous,
        borderRadius: radii.lg,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        ...typography.button,
    },
});

export default ButtonGradient;