import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { radii } from "../../styles/dimens";
import { typography } from "../../styles/typography";
import InfoIcon from "../common/InfoIcon";
import { getInputInfo } from "../../utils/inputInfo";

const ICONS = {
    email: <MaterialIcons name="email" size={20} color={colors.icon} />,
    password: <Ionicons name="lock-closed" size={20} color={colors.icon} />,
};

export type AuthInputProps = {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    type?: "text" | "email" | "password";
    onInfoPress?: () => void;
};

const AuthInput: React.FC<AuthInputProps> = ({
                                                 label,
                                                 placeholder,
                                                 value,
                                                 onChangeText,
                                                 type = "text",
                                                 onInfoPress,
                                             }) => {
    const isPassword = type === "password";
    const isEmail = type === "email";
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const icon = isEmail ? ICONS.email : isPassword ? ICONS.password : null;
    const infoText = getInputInfo(type);

    const showInfoIcon = Boolean(onInfoPress || isPassword || isEmail);

    const handleInfoPress = () => {
        if (onInfoPress) {
            onInfoPress();
            return;
        }

        const title =
            type === "email"
                ? "About your email"
                : type === "password"
                    ? "Password requirements"
                    : "Info";

        if (infoText) {
            Alert.alert(title, infoText);
        }
    };

    const togglePasswordVisibility = () => {
        if (isPassword) {
            setIsPasswordVisible((prev) => !prev);
        }
    };


    return (
        <View style={styles.wrapper}>
            {!!label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.inputContainer}>
                {icon}

                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={colors.placeholder}
                    secureTextEntry={isPassword && !isPasswordVisible}
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChangeText}
                />

                {isPassword && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={togglePasswordVisibility}
                        accessibilityRole="button"
                        accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
                    >
                        <Ionicons
                            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={colors.icon}
                        />
                    </TouchableOpacity>
                )}

                {showInfoIcon && (
                    <InfoIcon
                        onPress={handleInfoPress}
                        style={{ marginLeft: spacing.lg }}
                    />
                )}
            </View>
        </View>
    );
};

export default AuthInput;

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: spacing.enormous,
    },
    label: {
        marginBottom: spacing.lg,
        ...typography.label,
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
    iconButton: {
        marginLeft: spacing.lg,
        padding: spacing.sm,
    },
});
