// app/(auth)/login.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity,Alert} from "react-native";
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
import { signIn } from "../../src/services/auth.service";
import { setUserId } from "../../src/lib/authStorage";

const Login: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showEmailInfo, setShowEmailInfo] = useState(false);
    const [showPasswordInfo, setShowPasswordInfo] = useState(false);

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

    const handleLogin = async () => {
        try {
            const response = await signIn({ email, password });
            const userId = response?.user?.id;
            if (userId) {
                await setUserId(userId);
            }
            router.replace("/(app)/home");
        } catch (error: any) {
            Alert.alert("Login failed", error?.message || "Please try again.");
        }
        router.replace("/(app)/home");
    };

    return (
        <BackgroundAuth>
            <AuthLayout
                title="Welcome Back"
                subtitle="Sign in to continue to your account"
                onBackPress={() => router.back()}
                footer={
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                            <Text style={styles.footerLink}> Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                }
            >
                <View style={styles.fieldWrapper}>
                    <AuthInput
                        label="Email Address"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChangeText={setEmail}
                        onInfoPress={toggleEmailInfo}
                    />
                </View>

                {showEmailInfo && (
                    <TooltipInfo
                        title="Email format"
                        messages={["Use a valid address", "Example: name@example.com"]}
                    />
                )}

                <View style={styles.fieldWrapper}>
                    <AuthInput
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChangeText={setPassword}
                        onInfoPress={togglePasswordInfo}
                    />
                </View>

                {showPasswordInfo && (
                    <TooltipInfo
                        title="Password requirements"
                        messages={[
                            "At least 8 characters",
                            "One uppercase letter",
                            "One lowercase letter",
                            "One number",
                        ]}
                    />
                )}

                <TouchableOpacity
                    style={styles.forgotWrapper}
                    onPress={() => router.push("/(auth)/forgot-password")}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <PrimaryButton title="Login" onPress={handleLogin} />

                <DividerWithText label="OR CONTINUE WITH" />

                <GoogleButton title="Login with Google" onPress={() => {}} />
            </AuthLayout>
        </BackgroundAuth>
    );
};


const styles = StyleSheet.create({
    fieldWrapper: {
        position: "relative",
        width: "100%",
        marginBottom: spacing.md,
    },
    forgotWrapper: {
        alignItems: "flex-end",
        marginTop: spacing.sm,
        marginBottom: spacing.enormous,
    },
    forgotText: {
        color: colors.accent,
        fontWeight: "600",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "center",
    },
    footerText: {
        color: colors.textSecondary,
    },
    footerLink: {
        color: colors.accent,
        fontWeight: "700",
    },
});

export default Login;
