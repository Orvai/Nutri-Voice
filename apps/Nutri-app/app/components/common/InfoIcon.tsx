import React from "react";
import {View, TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";

type InfoIconProps = {
    onPress: () => void;
    style?: ViewStyle;
};

const ICON_SIZE = 18;

const InfoIcon: React.FC<InfoIconProps> = ({ onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.hitbox, style]}>
        <View style={styles.container}>
            <Text style={styles.text}>i</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    hitbox: {
        padding: 10,
    },

    container: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        borderRadius: ICON_SIZE / 2,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: "white",
    },

    text: {
        ...typography.helper,
        fontSize: 11,
        lineHeight: 11,
        fontWeight: "600",
        color: colors.textSecondary,
    },
});

export default InfoIcon;
