import React, { useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BackgroundAuth from "../components/common/BackgroundAuth";
import AuthLayout from "../components/auth/AuthLayout";
import StepHeader from "../components/auth/StepHeader";
import RequiredDetailsForm, {RequiredDetailsPayload,} from "../components/auth/RequiredDetailsForm";
import { signUp } from "../../src/services/auth.service";
import { setUserId } from "../../src/lib/authStorage";

export default function RegisterDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    const email = (params.email as string) || "";
    const password = (params.password as string) || "";

    const handleSubmit = async (payload: RequiredDetailsPayload) => {
        setLoading(true);
        try {
            const response = await signUp({
                email,
                phone: payload.phone,
                firstName: payload.firstName,
                lastName: payload.lastName,
                password,
            });

            const userId = response?.user?.id;
            if (userId) {
                await setUserId(userId);
            }

            router.push({
                pathname: "/(auth)/register-user-info",
                params: {
                    phone: payload.phone,
                    callingCode: payload.callingCode,
                    countryIso: payload.countryIso,
                    countryName: payload.countryName,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                },
            });
        } catch (error: any) {
            Alert.alert("Registration failed", error?.message || "Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
            return;
        }

        router.replace("/(auth)/register");
    };


    return (
        <BackgroundAuth>
            <AuthLayout
                title="Tell us about you"
                subtitle="Personal details & profile"
                showBack
                showLogo = {false}
                onBackPress={handleBack}
                headerContent={
                    <StepHeader
                        step={2}
                        totalSteps={4}
                        subtitle="Personal details & profile"
                    />
                }
            >
                <RequiredDetailsForm onSubmit={handleSubmit} />
            </AuthLayout>
        </BackgroundAuth>
    );
}
