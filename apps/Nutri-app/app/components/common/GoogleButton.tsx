import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { radii } from "../../styles/dimens";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";

interface GoogleButtonProps {
    title?: string;
    onPress: () => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ title = "Continue with Google", onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <AntDesign name="google" size={20} color={colors.textPrimary} />
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        alignSelf: "stretch",
        marginTop: spacing.lg,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: spacing.xl,
        backgroundColor: colors.white,
    },
    text: {
        marginLeft: spacing.xl,
        ...typography.button,
        color: colors.textPrimary,
    },
});

export default GoogleButton;