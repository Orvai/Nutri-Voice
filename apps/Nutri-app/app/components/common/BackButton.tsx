import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { radii } from "../../styles/dimens";
import { spacing } from "../../styles/spacing";
import { shadows } from "../../styles/shadows";

type BackButtonProps = {
    onPress: () => void;
};

const BackButton: React.FC<BackButtonProps> = ({ onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: radii.xl,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.giant,
        ...shadows.subtle,
    },
});

export default BackButton;