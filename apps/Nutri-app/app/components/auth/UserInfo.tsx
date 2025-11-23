import React, { useEffect, useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import Card from "../common/Card";
import CitySelector from "../common/CitySelector";
import CountrySelector from "../common/CountrySelector";
import PrimaryButton from "../common/PrimaryButton";
import { useCountryPicker } from "../../hooks/useCountryPicker";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { radii } from "../../styles/dimens";
import { typography } from "../../styles/typography";
import { GENDERS } from "../../utils/constants";
import { CITIES_BY_COUNTRY } from "../../utils/locationData";
import { formatDobInput, parseDob, trimInput } from "../../utils/format";

export type UserInfoPayload = {
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    countryCode: string;
    countryName: string;
    postalCode?: string;
};

interface UserInfoProps {
    onSubmit: (payload: UserInfoPayload) => void | Promise<void>;
    onSkip: () => void;
    initialCountryCode?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ onSubmit, onSkip, initialCountryCode = "US" }) => {
    const countryPicker = useCountryPicker(initialCountryCode.toUpperCase());

    const [dateOfBirth, setDateOfBirth] = useState("");
    const [showDobPicker, setShowDobPicker] = useState(false);

    const [gender, setGender] = useState<string>("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isCityPickerOpen, setIsCityPickerOpen] = useState(false);

    const availableCities = useMemo(
        () => CITIES_BY_COUNTRY[countryPicker.selectedCode] || [],
        [countryPicker.selectedCode]
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

    const handleCountryChange = (code: string) => {
        countryPicker.handleSelect(code);
    };

    const handleContinue = async () => {
        if (dateOfBirth.trim()) {
            const parsed = parseDob(dateOfBirth.trim());
            if (!parsed) {
                setError("Please enter a valid date of birth (DD/MM/YYYY).");
                return;
            }
        }

        setError(null);
        await onSubmit({
            dateOfBirth: dateOfBirth.trim() || undefined,
            gender,
            address: trimInput(address) || undefined,
            city: city || undefined,
            countryCode: countryPicker.selectedCode,
            countryName: countryPicker.selectedCountry.name,
            postalCode: trimInput(postalCode) || undefined,
        });
    };

    return (
        <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
        >
            <View style={styles.formContainer}>
                <Card>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.optionalTag}>Optional</Text>
                    </View>
                    <Text style={styles.sectionHelper}>
                        These details help us tailor recommendations and improve your experience.
                    </Text>

                    {/* DATE OF BIRTH — WITH CALENDAR PICKER */}
                    <Text style={styles.label}>Date of Birth</Text>

                    {Platform.OS === "web" ? (
                        // Web: text input with auto-formatting DD/MM/YYYY
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="number-pad"
                            value={dateOfBirth}
                            onChangeText={(value) => setDateOfBirth(formatDobInput(value))}
                            maxLength={10}
                        />
                    ) : (
                        // Native (iOS / Android): open calendar picker and fill DD/MM/YYYY
                        <>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowDobPicker(true)}
                                activeOpacity={0.8}
                            >
                                <Text style={dateOfBirth ? styles.pickerValue : styles.pickerPlaceholder}>
                                    {dateOfBirth || "DD/MM/YYYY"}
                                </Text>
                            </TouchableOpacity>

                            {showDobPicker && (
                                <DateTimePicker
                                    mode="date"
                                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                                    value={
                                        parseDob(dateOfBirth || "") ||
                                        new Date(1990, 0, 1)
                                    }
                                    maximumDate={new Date()}
                                    onChange={(_, selectedDate) => {
                                        if (Platform.OS === "android") {
                                            setShowDobPicker(false);
                                        }

                                        if (selectedDate) {
                                            const dd = selectedDate.getDate().toString().padStart(2, "0");
                                            const mm = (selectedDate.getMonth() + 1)
                                                .toString()
                                                .padStart(2, "0");
                                            const yyyy = selectedDate.getFullYear();
                                            const formatted = `${dd}/${mm}/${yyyy}`;
                                            setDateOfBirth(formatted);
                                            setError(null);
                                        }
                                    }}
                                />
                            )}
                        </>
                    )}

                    {/* GENDER */}
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderRow}>
                        {GENDERS.map((option) => {
                            const isSelected = gender === option.key;
                            return (
                                <TouchableOpacity
                                    key={option.key}
                                    style={[styles.genderButton, isSelected && styles.genderSelected]}
                                    onPress={() => setGender(option.key)}
                                >
                                    <Ionicons
                                        name={option.icon as any}
                                        size={16}
                                        color={isSelected ? colors.accentAlt : colors.textSecondary}
                                    />
                                    <Text
                                        style={[
                                            styles.genderLabel,
                                            isSelected && styles.genderLabelSelected,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* ADDRESS */}
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Street address"
                        placeholderTextColor={colors.textMuted}
                        value={address}
                        onChangeText={setAddress}
                    />

                    {/* CITY + COUNTRY */}
                    <View style={styles.twoColumn}>
                        <View style={styles.columnItem}>
                            <Text style={styles.label}>City</Text>
                            <TouchableOpacity style={styles.input} onPress={() => setIsCityPickerOpen(true)}>
                                <Text style={city ? styles.pickerValue : styles.pickerPlaceholder}>
                                    {city || "Select city"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.columnItem}>
                            <Text style={styles.label}>Country</Text>
                            <CountrySelector
                                selectedCode={countryPicker.selectedCode}
                                isOpen={countryPicker.isPickerOpen}
                                onOpen={countryPicker.openPicker}
                                onClose={countryPicker.closePicker}
                                onSelect={handleCountryChange}
                                showCallingCode={false}
                                title="Select country"
                                renderTrigger={({ selectedCountry, onPress }) => (
                                    <TouchableOpacity style={styles.input} onPress={onPress}>
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

                    {/* POSTAL CODE */}
                    <Text style={styles.label}>Postal Code</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Postal Code"
                        placeholderTextColor={colors.textMuted}
                        value={postalCode}
                        onChangeText={setPostalCode}
                    />

                    {/* PROFILE IMAGE */}
                    <Text style={styles.label}>Profile Image</Text>
                    <View style={styles.avatarRow}>
                        <View style={styles.avatarPreview}>
                            <Ionicons name="person-circle-outline" size={40} color={colors.textMuted} />
                        </View>
                        <View style={styles.avatarInputArea}>
                            <TouchableOpacity style={styles.addPhotoButton}>
                                <Ionicons name="camera-outline" size={18} color={colors.textPrimary} />
                                <Text style={styles.addPhotoText}>Add a profile photo</Text>
                            </TouchableOpacity>
                            <Text style={styles.avatarHelper}>
                                You can upload a photo later from your profile settings.
                            </Text>
                        </View>
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}
                </Card>

                <PrimaryButton title="Continue" onPress={handleContinue} />

                <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
                    <Text style={styles.skipText}>Skip this step</Text>
                </TouchableOpacity>
            </View>
            <CitySelector
                visible={isCityPickerOpen}
                onClose={() => setIsCityPickerOpen(false)}
                cities={availableCities}
                selectedCity={city}
                onSelect={(value) => setCity(value)}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.enormous,
        alignItems: "center",
    },
    formContainer: {
        width: "100%",
        maxWidth: 560,
        alignSelf: "center",
        gap: spacing.xxl,
    },
    sectionHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.sm,
    },
    sectionHeader: {
        ...typography.body,
        fontWeight: "700",
    },
    sectionHelper: {
        ...typography.helper,
        marginBottom: spacing.xl,
    },
    optionalTag: {
        ...typography.helper,
        color: colors.accent,
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
    avatarRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.lg,
        marginTop: spacing.lg,
        flexWrap: "wrap",
    },
    avatarPreview: {
        width: 56,
        height: 56,
        borderRadius: radii.full,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.tooltipBg,
    },
    avatarInputArea: {
        flex: 1,
        gap: spacing.sm,
    },
    addPhotoButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        borderRadius: radii.full,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.md,
        backgroundColor: colors.tooltipBg,
    },
    addPhotoText: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    avatarHelper: {
        ...typography.helper,
        marginTop: spacing.sm,
    },
    errorText: {
        marginTop: spacing.xs,
        marginBottom: spacing.xl,
        fontSize: 12,
        color: colors.errorAccent,
    },
    skipButton: {
        alignItems: "center",
        marginTop: spacing.md,
    },
    skipText: {
        color: colors.textSecondary,
        fontWeight: "700",
    },
});

export default UserInfo;
