// app/(auth)/forgot-password.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import BackgroundAuth from "../components/common/BackgroundAuth";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import PrimaryButton from "../components/common/PrimaryButton";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { typography } from "../styles/typography";
import { validateEmail } from "../utils/validators";
import * as authService from "../../src/services/auth.service";

const ForgotPassword: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [apiError, setApiError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (successTimeoutRef.current) {
                clearTimeout(successTimeoutRef.current);
            }
        };
    }, []);

    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        setApiError("");
        setSuccessMessage("");

        const emailValidation = validateEmail(email);
        setEmailError(emailValidation);

        if (emailValidation) {
            return;
        }

        try {
            setIsSubmitting(true);
            //await authService.forgotPassword({ email: email.trim() });
            setSuccessMessage("If an account exists for this email, a reset link has been sent.");
            successTimeoutRef.current = setTimeout(() => {
                router.replace("/(auth)/login");
            }, 1600);
        } catch (error) {
            setApiError("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BackgroundAuth>
            <AuthLayout
                title="Forgot your password?"
                subtitle="Enter your email and we'll send you a reset link."
                showBack
                onBackPress={() => router.back()}
                footer={
                    <TouchableOpacity
                        style={styles.footerLinkWrapper}
                        onPress={() => router.replace("/(auth)/login")}
                    >
                        <Text style={styles.footerLink}>Back to login</Text>
                    </TouchableOpacity>
                }
            >
                <View style={styles.fieldWrapper}>
                    <AuthInput
                        label="Email Address"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChangeText={(value: string) => {
                            setEmail(value);
                            if (emailError) {
                                setEmailError("");
                            }
                            if (apiError) {
                                setApiError("");
                            }
                            if (successMessage) {
                                setSuccessMessage("");
                            }
                        }}
                    />
                </View>

                {emailError ? <Text style={styles.fieldErrorText}>{emailError}</Text> : null}

                <PrimaryButton title="Send reset link" onPress={handleSubmit} />

                {apiError ? <Text style={styles.formErrorText}>{apiError}</Text> : null}

                {successMessage ? (
                    <Text style={styles.successText}>{successMessage}</Text>
                ) : null}

            </AuthLayout>
        </BackgroundAuth>
    );
};

const styles = StyleSheet.create({
    fieldWrapper: {
        width: "100%",
        marginBottom: spacing.xs,
    },
    fieldErrorText: {
        color: colors.errorAccent,
        fontSize: 12,
        marginTop: spacing.xs,
        marginBottom: spacing.xxxl,
    },
    formErrorText: {
        color: colors.errorAccent,
        fontSize: 13,
        marginTop: spacing.lg,
        textAlign: "center",
    },
    successText: {
        ...typography.helper,
        color: colors.accent,
        textAlign: "center",
        marginTop: spacing.md,
    },
    footerLinkWrapper: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    footerLink: {
        color: colors.accent,
        fontWeight: "700",
    },
});

export default ForgotPassword;