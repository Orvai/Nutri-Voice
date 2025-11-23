// app/(auth)/register.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import BackgroundAuth from "../components/common/BackgroundAuth";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import PrimaryButton from "../components/common/PrimaryButton";
import GoogleButton from "../components/common/GoogleButton";
import TooltipInfo from "../components/common/TooltipInfo";
import DividerWithText from "../components/common/DividerWithText";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { radii } from "../styles/dimens";
import { validateEmail, validatePassword } from "../utils/validators";
import { PASSWORD_RULES } from "../utils/constants";


const Register: React.FC = () => {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [formError, setFormError] = useState<string>("");

    const [showEmailInfo, setShowEmailInfo] = useState<boolean>(false);
    const [showPasswordInfo, setShowPasswordInfo] = useState<boolean>(false);


    const toggleEmailInfo = () => {
        setShowEmailInfo((prev) => {
            const next = !prev;
            if (next) {
                setShowPasswordInfo(false);
            }
            return next;
        });
    };

    const togglePasswordInfo = () => {
        setShowPasswordInfo((prev) => {
            const next = !prev;
            if (next) {
                setShowEmailInfo(false);
            }
            return next;
        });
    };


    const handleContinue = () => {
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        setEmailError(emailErr);
        setPasswordError(passwordErr);
        if (emailErr || passwordErr) {
            setFormError("Please complete email and password correctly.");
            return;
        }
        setFormError("");
        router.push({
            pathname: "/(auth)/register-details",
            params: { email, password },
        });
    };

    return (
        <BackgroundAuth>
            <AuthLayout
                title="Create Account"
                subtitle="Sign up to get started"
                showBack={false}
                onBackPress={() => router.back()}
                footer={
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                            <Text style={styles.footerLink}> Log In</Text>
                        </TouchableOpacity>
                    </View>
                }
            >

                {formError ? (
                    <View style={styles.formErrorBanner}>
                        <Text style={styles.formErrorText}>{formError}</Text>
                    </View>
                ) : null}

                <View style={styles.fieldWrapper}>
                    <AuthInput
                        label="Email Address"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChangeText={(text: string) => {
                            setEmail(text);
                            if (emailError || formError) {
                                setEmailError("");
                                setFormError("");
                            }
                        }}
                        onInfoPress={toggleEmailInfo}

                    />

                </View>
                {showEmailInfo && (
                    <TooltipInfo
                        title="Email format"
                        messages={[
                            "Must be a valid address",
                            "Example: name@example.com",
                            "No spaces",
                        ]}
                    />
                )}
                {emailError ? (<Text style={styles.fieldErrorText}>{emailError}</Text>) : null}

                <View style={styles.fieldWrapper}>
                    <AuthInput
                        label="Password"
                        placeholder="Create a password"
                        type="password"
                        value={password}
                        onChangeText={(text: string) => {
                            setPassword(text);
                            if (passwordError || formError) {
                                setPasswordError("");
                                setFormError("");
                            }
                        }}
                        onInfoPress={togglePasswordInfo}
                    />
                </View>

                {showPasswordInfo && (
                    <TooltipInfo
                        title="Password requirements"
                        messages={PASSWORD_RULES.map((rule) => `• ${rule.description}`)}
                    />
                )}
                {passwordError ? (
                    <Text style={styles.fieldErrorText}>{passwordError}</Text>
                ) : null}

                <PrimaryButton title="Continue" onPress={handleContinue} />

                <DividerWithText label="OR SIGN UP WITH" />

                <GoogleButton title="Sign Up with Google" onPress={() => {}} />

                <Text style={styles.termsText}>
                    By continuing, you agree to our{" "}
                    <Text style={styles.link}>Terms of Service</Text> and{" "}
                    <Text style={styles.link}>Privacy Policy</Text>
                </Text>
            </AuthLayout>
        </BackgroundAuth>
    );
};

const styles = StyleSheet.create({
    formErrorBanner: {
        backgroundColor: colors.errorBg,
        borderRadius: spacing.lg,
        paddingVertical: spacing.xxl,
        paddingHorizontal: spacing.enormous,
        marginBottom: spacing.enormous,
    },
    formErrorText: {
        color: colors.errorText,
        fontSize: 13,
        fontWeight: "500",
    },
    fieldWrapper: {
        position: "relative",
        width: "100%",
        marginBottom: spacing.xs,
    },
    fieldErrorText: {
        marginTop: spacing.xs,
        marginBottom: spacing.enormous,
        fontSize: 12,
        color: colors.errorAccent,
    },
    termsText: {
        textAlign: "center",
        fontSize: 12,
        color: colors.textMuted,
        marginTop: spacing.xl,
    },
    link: {
        color: colors.accent,
        fontWeight: "600",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: spacing.giant,
    },
    footerText: {
        color: colors.textSecondary,
    },
    footerLink: {
        color: colors.accent,
        fontWeight: "700",
    },
});

export default Register;
