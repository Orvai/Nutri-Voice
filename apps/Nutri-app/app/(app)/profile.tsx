import React, { useEffect, useMemo, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Card from "../components/common/Card";
import PrimaryButton from "../components/common/PrimaryButton";
import PhoneNumberRow from "../components/common/PhoneNumberRow";
import CitySelector from "../components/common/CitySelector";
import CountrySelector from "../components/common/CountrySelector";
import { usePhoneInput } from "../hooks/usePhoneInput";
import { useCountryPicker } from "../hooks/useCountryPicker";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { typography } from "../styles/typography";
import { radii } from "../styles/dimens";
import { shadows } from "../styles/shadows";
import { GENDERS } from "../utils/constants";
import { CITIES_BY_COUNTRY } from "../utils/locationData";
import { cleanPhoneInput, formatDobInput, parseDob, trimInput } from "../utils/format";
import { validateEmail, validatePhone } from "../utils/validators";

const AVATAR_PLACEHOLDER =
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80";

const mockCurrentUser = {
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "555 123 4567",
    callingCode: "+1",
    countryIso: "US",
    countryName: "United States",
    phoneVerified: true,
    profileImageUrl: AVATAR_PLACEHOLDER,
};

const mockUserInfo = {
    dateOfBirth: "12/08/1992",
    gender: "female",
    address: "123 Main Street",
    city: "New York",
    countryCode: "US",
    countryName: "United States",
    postalCode: "10001",
    profileImageUrl: AVATAR_PLACEHOLDER,
};

export default function Profile() {
    const router = useRouter();

    const phoneState = usePhoneInput(mockCurrentUser.phone, mockCurrentUser.countryIso);
    const locationPicker = useCountryPicker(mockUserInfo.countryCode);

    const [fullName, setFullName] = useState(mockCurrentUser.fullName);
    const [email, setEmail] = useState(mockCurrentUser.email);
    const [dateOfBirth, setDateOfBirth] = useState(mockUserInfo.dateOfBirth);
    const [gender, setGender] = useState<string>(mockUserInfo.gender);
    const [address, setAddress] = useState(mockUserInfo.address);
    const [city, setCity] = useState(mockUserInfo.city);
    const [postalCode, setPostalCode] = useState(mockUserInfo.postalCode);
    const [profileImageUrl, setProfileImageUrl] = useState(
        mockUserInfo.profileImageUrl || mockCurrentUser.profileImageUrl
    );

    const [isCityPickerOpen, setIsCityPickerOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const availableCities = useMemo(
        () => CITIES_BY_COUNTRY[locationPicker.selectedCode] || [],
        [locationPicker.selectedCode]
    );

    useEffect(() => {
        if (!availableCities.length) {
            setCity("");
            return;
        }

        if (!availableCities.includes(city)) {
            setCity(availableCities[0]);
        }
    }, [availableCities, city]);

    const handleSave = async () => {
        const trimmedName = trimInput(fullName);
        const trimmedEmail = trimInput(email);
        const dobValue = dateOfBirth.trim();
        const parsedDob = dobValue ? parseDob(dobValue) : null;

        const phoneValidation = validatePhone(cleanPhoneInput(phoneState.phone));
        const emailValidation = trimmedEmail ? validateEmail(trimmedEmail) : "";

        if (!trimmedName) {
            setError("Full name is required.");
            setSuccess(null);
            return;
        }

        if (emailValidation) {
            setError(emailValidation);
            setSuccess(null);
            return;
        }

        if (phoneValidation) {
            setError(phoneValidation);
            setSuccess(null);
            return;
        }

        if (dobValue && !parsedDob) {
            setError("Please enter a valid date of birth (DD/MM/YYYY).");
            setSuccess(null);
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const corePayload = {
                name: trimmedName,
                email: trimmedEmail,
                phone: phoneState.cleanedPhone,
                callingCode: phoneState.selectedCountry.callingCode,
                countryIso: phoneState.selectedCode,
            };

            const userInfoPayload = {
                dateOfBirth: dobValue || undefined,
                gender: gender || undefined,
                address: trimInput(address) || undefined,
                city: city || undefined,
                countryCode: locationPicker.selectedCode,
                countryName: locationPicker.selectedCountry.name,
                postalCode: trimInput(postalCode) || undefined,
                profileImageUrl: profileImageUrl || undefined,
            };

            // TODO: replace with real API calls (e.g., authService.updateProfile, userInfoService.upsertUserInfo)
            await Promise.all([
                Promise.resolve(corePayload),
                Promise.resolve(userInfoPayload),
            ]);

            setSuccess("Profile updated successfully.");
        } catch (_err) {
            setError("Something went wrong while saving. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCountryChange = (code: string) => {
        locationPicker.handleSelect(code);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.replace("/(app)/settings")}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>

                    <View style={styles.headerText}>
                        <Text style={styles.title}>Personal Profile</Text>
                        <Text style={styles.subtitle}>Update your information</Text>
                    </View>
                </View>

                <Card style={styles.avatarCard}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: profileImageUrl || AVATAR_PLACEHOLDER }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.cameraButton} activeOpacity={0.85}>
                                <Ionicons name="camera" size={16} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity activeOpacity={0.85}>
                            <Text style={styles.avatarHelper}>Tap to change photo</Text>
                        </TouchableOpacity>
                    </View>
                </Card>

                <Card style={styles.formCard}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter your full name"
                        placeholderTextColor={colors.textMuted}
                    />

                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={email}
                        editable={false}
                        placeholder="Email address"
                        placeholderTextColor={colors.textMuted}
                    />

                    <Text style={styles.label}>Phone Number</Text>
                    <PhoneNumberRow
                        phone={phoneState.phone}
                        onChangePhone={phoneState.setPhone}
                        countryCode={phoneState.selectedCode}
                        onChangeCountry={phoneState.setCountryByCode}
                        isPickerOpen={phoneState.isPickerOpen}
                        onOpenPicker={phoneState.openPicker}
                        onClosePicker={phoneState.closePicker}
                    />
                    <Text style={styles.verifiedText}>Verified</Text>

                    <Text style={styles.label}>Date of Birth</Text>
                    <View style={styles.inputWithIcon}>
                        <TextInput
                            style={[styles.input, styles.iconInput]}
                            value={dateOfBirth}
                            onChangeText={(value) => setDateOfBirth(formatDobInput(value))}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="number-pad"
                            maxLength={10}
                        />
                        <Ionicons
                            name="calendar-outline"
                            size={18}
                            color={colors.textSecondary}
                            style={styles.inputIcon}
                        />
                    </View>

                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderRow}>
                        {GENDERS.map((option) => {
                            const isSelected = gender === option.key;
                            return (
                                <TouchableOpacity
                                    key={option.key}
                                    style={[styles.genderButton, isSelected && styles.genderSelected]}
                                    onPress={() => setGender(option.key)}
                                    activeOpacity={0.85}
                                >
                                    <Ionicons
                                        name={option.icon as any}
                                        size={16}
                                        color={isSelected ? colors.accentAlt : colors.textSecondary}
                                    />
                                    <Text
                                        style={[styles.genderLabel, isSelected && styles.genderLabelSelected]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Street address"
                        placeholderTextColor={colors.textMuted}
                    />

                    <View style={styles.twoColumn}>
                        <View style={styles.columnItem}>
                            <Text style={styles.label}>City</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setIsCityPickerOpen(true)}
                                activeOpacity={0.85}
                            >
                                <Text style={city ? styles.pickerValue : styles.pickerPlaceholder}>
                                    {city || "Select city"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.columnItem}>
                            <Text style={styles.label}>Country</Text>
                            <CountrySelector
                                selectedCode={locationPicker.selectedCode}
                                isOpen={locationPicker.isPickerOpen}
                                onOpen={locationPicker.openPicker}
                                onClose={locationPicker.closePicker}
                                onSelect={handleCountryChange}
                                showCallingCode={false}
                                title="Select country"
                                renderTrigger={({ selectedCountry, onPress }) => (
                                    <TouchableOpacity style={styles.input} onPress={onPress} activeOpacity={0.85}>
                                        <View style={styles.countryFieldRow}>
                                            <Text style={styles.flagText}>{selectedCountry.flag}</Text>
                                            <Text
                                                style={
                                                    selectedCountry.name
                                                        ? styles.pickerValue
                                                        : styles.pickerPlaceholder
                                                }
                                                numberOfLines={1}
                                            >
                                                {selectedCountry.name || "Select country"}
                                            </Text>
                                            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Postal Code</Text>
                    <TextInput
                        style={styles.input}
                        value={postalCode}
                        onChangeText={setPostalCode}
                        placeholder="Postal Code"
                        placeholderTextColor={colors.textMuted}
                        keyboardType="number-pad"
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {success && <Text style={styles.successText}>{success}</Text>}

                    <PrimaryButton title={isSaving ? "Saving..." : "Save Changes"} onPress={handleSave} />
                </Card>
            </ScrollView>

            <CitySelector
                visible={isCityPickerOpen}
                onClose={() => setIsCityPickerOpen(false)}
                cities={availableCities}
                selectedCity={city}
                onSelect={(value) => setCity(value)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: spacing.enormous * 2,
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingHorizontal: spacing.enormous,
        paddingBottom: spacing.enormous * 2,
        gap: spacing.enormous,
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xxl,
        width: "100%",
        maxWidth: 780,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: radii.lg,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.borderMuted,
        ...shadows.subtle,
    },
    headerText: {
        flex: 1,
        gap: spacing.xs,
    },
    title: {
        ...typography.heading,
    },
    subtitle: {
        ...typography.subtitle,
        color: colors.textMuted,
    },
    avatarCard: {
        width: "100%",
        maxWidth: 780,
        alignSelf: "center",
        alignItems: "center",
    },
    avatarWrapper: {
        alignItems: "center",
        gap: spacing.lg,
    },
    avatarContainer: {
        position: "relative",
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: radii.full,
        borderWidth: 2,
        borderColor: colors.borderMuted,
    },
    cameraButton: {
        position: "absolute",
        bottom: 8,
        right: 8,
        width: 36,
        height: 36,
        borderRadius: radii.full,
        backgroundColor: colors.accentAlt,
        alignItems: "center",
        justifyContent: "center",
        ...shadows.medium,
    },
    avatarHelper: {
        ...typography.helper,
        color: colors.accentAlt,
        fontWeight: "700",
    },
    formCard: {
        width: "100%",
        maxWidth: 780,
        alignSelf: "center",
    },
    label: {
        ...typography.label,
        marginBottom: spacing.lg,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radii.md,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xxl,
        fontSize: typography.button.fontSize,
        color: colors.textPrimary,
        marginBottom: spacing.xl,
        backgroundColor: colors.white,
    },
    disabledInput: {
        backgroundColor: colors.tooltipBg,
        color: colors.textSecondary,
    },
    verifiedText: {
        ...typography.helper,
        color: colors.success,
        marginTop: -spacing.md,
        marginBottom: spacing.xl,
        fontWeight: "600",
    },
    inputWithIcon: {
        position: "relative",
    },
    iconInput: {
        paddingRight: spacing.giant,
    },
    inputIcon: {
        position: "absolute",
        right: spacing.xl,
        top: spacing.lg + 2,
    },
    genderRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    genderButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        borderRadius: radii.full,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.tooltipBg,
    },
    genderSelected: {
        borderColor: colors.accentAlt,
        backgroundColor: colors.highlight,
    },
    genderLabel: {
        ...typography.helper,
        color: colors.textSecondary,
    },
    genderLabelSelected: {
        ...typography.helper,
        color: colors.accentAlt,
    },
    twoColumn: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.lg,
        marginBottom: spacing.xl,
    },
    columnItem: {
        flex: 1,
        minWidth: 150,
    },
    pickerValue: {
        ...typography.body,
        color: colors.textPrimary,
    },
    pickerPlaceholder: {
        ...typography.helper,
        color: colors.textMuted,
    },
    countryFieldRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.md,
    },
    flagText: {
        fontSize: 20,
        marginRight: spacing.md,
    },
    errorText: {
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
        fontSize: 12,
        color: colors.errorAccent,
    },
    successText: {
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
        fontSize: 12,
        color: colors.success,
        fontWeight: "600",
    },
});
