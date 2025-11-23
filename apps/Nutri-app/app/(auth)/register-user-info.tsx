import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import BackgroundAuth from "..//components/common/BackgroundAuth";
import AuthLayout from "../components/auth/AuthLayout";
import StepHeader from "../components/auth/StepHeader";
import UserInfo, { UserInfoPayload } from "../components/auth/UserInfo";
import { Alert } from "react-native";
import { upsertUserInformation } from "../../src/services/user.service";
import { getUserId } from "../../src/lib/authStorage";


export default function RegisterUserInfo() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const phone = (params.phone as string) || "";
    const callingCode = (params.callingCode as string) || "";
    const countryIso = ((params.countryIso as string) || "US").toUpperCase();
    const countryName = (params.countryName as string) || "";

    const navigateToVerification = () => {
        router.push({
            pathname: "/(auth)/register-phone-verification",
            params: { phone, callingCode, countryIso, countryName },
        });
    };

    const handleContinue = async (payload: UserInfoPayload) => {
        try {
            const storedUserId = await getUserId();
            if (!storedUserId) {
                throw new Error("Missing user information.");
            }

            await upsertUserInformation(storedUserId, {
                dateOfBirth: payload.dateOfBirth || "",
                gender: payload.gender || "",
                address: payload.address || "",
                city: payload.city || "",
                country: payload.countryName,
                postalCode: payload.postalCode || "",
                profileImageUrl: "",
            });

            navigateToVerification();
        } catch (error: any) {
            Alert.alert("Update failed", error?.message || "Unable to save your details.");
        }
    };

    return (
        <BackgroundAuth>
            <AuthLayout
                title="More about you"
                subtitle="Optional profile details"
                showBack
                onBackPress={() => router.back()}
                showLogo = {false}
                headerContent={
                    <StepHeader
                        step={3}
                        totalSteps={4}
                        subtitle="Optional profile details"
                    />
                }
            >
                <UserInfo
                    onSubmit={handleContinue}
                    onSkip={navigateToVerification}
                    initialCountryCode={countryIso}
                />
            </AuthLayout>
        </BackgroundAuth>
    );
}
