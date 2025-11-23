import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import BackgroundAuth from "../components/common/BackgroundAuth";
import AuthLayout from "../components/auth/AuthLayout";
import StepHeader from "../components/auth/StepHeader";
import PrimaryButton from "../components/common/PrimaryButton";
import PhoneNumberRow from "../components/common/PhoneNumberRow";
import CountrySelector from "../components/common/CountrySelector";
import Card from "../components/common/Card";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { radii } from "../styles/dimens";
import { typography } from "../styles/typography";
import { usePhoneInput } from "../hooks/usePhoneInput";
import { validateVerificationCode } from "../utils/validators";
import { cleanNumericInput } from "../utils/format";

export default function registerPhoneVerification() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const initialCountryIso = ((params.countryIso as string) || "US").toUpperCase();
    const initialPhone = (params.phone as string) || "";

    const phoneState = usePhoneInput(initialPhone, initialCountryIso);
    const [countryName, setCountryName] = useState((params.countryName as string) || phoneState.selectedCountry.name);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState<"phone" | "code">("phone");
    const isCodeStep = step === "code";

    const handleCountryChange = (code: string) => {
        phoneState.setCountryByCode(code);
        const chosen = phoneState.countryOptions.find((item) => item.code === code);
        setCountryName(chosen?.name || countryName);
        phoneState.closePicker();
    };

    const handleSendCode = () => {
        if (phoneState.phoneError) {
            setError(phoneState.phoneError);
            return;
        }
        setError("");
        setStep("code");
        setCode("");
    };

    const handleCodeChange = (value: string) => {
        const numeric = cleanNumericInput(value, 6);
        setCode(numeric);
    };

    const handleBackToPhone = () => {
        setStep("phone");
        setCode("");
    };

    const handleVerify = () => {
        const validation = validateVerificationCode(code);
        if (validation) {
            setError(validation);
            return;
        }
        router.replace("/(app)/home");
    };

    return (
        <BackgroundAuth>
            <AuthLayout
                title="Verify your phone"
                subtitle="We’ll send a 6-digit code to confirm your number."
                showBack
                onBackPress={() => router.back()}
                showLogo = {false}
                headerContent={
                    <StepHeader
                        step={4}
                        totalSteps={4}
                        subtitle="Verify your phone number"
                    />
                }
            >
                <Card>
                    {!isCodeStep ? (
                        <>
                            <Text style={styles.label}>Phone number</Text>
                            <PhoneNumberRow
                                phone={phoneState.phone}
                                onChangePhone={phoneState.setPhone}
                                countryCode={phoneState.selectedCode}
                                onChangeCountry={handleCountryChange}
                                isPickerOpen={phoneState.isPickerOpen}
                                onOpenPicker={phoneState.openPicker}
                                onClosePicker={phoneState.closePicker}
                            />
                            <Text style={styles.helperText}>
                                Auto-filled from your registration details ({countryName}).
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.label}>Verification code</Text>
                            <Text style={styles.helperText}>
                                Enter the 6-digit code we sent to {phoneState.selectedCountry.callingCode}{" "}
                                {phoneState.phone}.
                            </Text>
                            <TextInput
                                style={[styles.input, { marginTop: spacing.lg }]}
                                placeholder="••••••"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="number-pad"
                                value={code}
                                onChangeText={handleCodeChange}
                                maxLength={6}
                            />
                            <View style={styles.infoRow}>
                                <Ionicons name="lock-closed" size={16} color={colors.accentAlt} />
                                <Text style={styles.infoText}>
                                    Your phone is used only for security and account protection.
                                </Text>
                            </View>
                        </>
                    )}
                </Card>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <PrimaryButton
                    title={isCodeStep ? "Verify & Continue" : "Send verification code"}
                    onPress={isCodeStep ? handleVerify : handleSendCode}
                />

                {isCodeStep && (
                    <TouchableOpacity style={styles.resendRow} onPress={handleBackToPhone}>
                        <Ionicons name="refresh" size={16} color={colors.accentAlt} />
                        <Text style={styles.resendText}>Resend – edit phone number</Text>
                    </TouchableOpacity>
                )}
            </AuthLayout>
        </BackgroundAuth>
    );
}

const styles = StyleSheet.create({
    label: {
        ...typography.label,
        marginBottom: spacing.lg,
    },
    helperText: {
        ...typography.helper,
        marginTop: spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radii.md,
        padding: spacing.enormous,
        fontSize: 20,
        letterSpacing: 4,
        textAlign: "center",
        color: colors.textPrimary,
        backgroundColor: colors.white,
    },
    infoRow: {
        flexDirection: "row",
        gap: spacing.md,
        marginTop: spacing.xl,
    },
    infoText: {
        color: colors.textSecondary,
        flex: 1,
        fontSize: 13,
    },
    resendRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        justifyContent: "center",
        marginTop: spacing.lg,
    },
    resendText: {
        color: colors.accentAlt,
        fontWeight: "700",
        fontSize: 13,
    },
    errorText: {
        color: colors.errorAccent,
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
});
