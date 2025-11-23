import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Card from "../common/Card";
import PhoneNumberRow from "../common/PhoneNumberRow";
import CountrySelector from "../common/CountrySelector";
import PrimaryButton from "../common/PrimaryButton";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { radii } from "../../styles/dimens";
import { typography } from "../../styles/typography";
import { validateRequiredFields } from "../../utils/validators";
import { trimInput } from "../../utils/format";
import { usePhoneInput } from "../../hooks/usePhoneInput";

export type RequiredDetailsPayload = {
    phone: string;
    callingCode: string;
    countryIso: string;
    countryName: string;
    firstName: string;
    lastName: string;
};

interface RequiredDetailsFormProps {
    onSubmit: (payload: RequiredDetailsPayload) => void | Promise<void>;
}

const RequiredDetailsForm: React.FC<RequiredDetailsFormProps> = ({ onSubmit }) => {
    const phoneState = usePhoneInput();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    const handleCountryChange = (code: string) => {
        phoneState.setCountryByCode(code);
    };

    const countryName = useMemo(
        () => phoneState.selectedCountry.name,
        [phoneState.selectedCountry.name]
    );

    const handleContinue = async () => {
        setHasAttemptedSubmit(true);
        const requiredError = validateRequiredFields(phoneState.phone, firstName, lastName);
        if (requiredError) {
            setError(requiredError);
            return;
        }

        setError(null);
        await onSubmit({
            phone: phoneState.cleanedPhone,
            callingCode: phoneState.selectedCountry.callingCode,
            countryIso: phoneState.selectedCode,
            countryName,
            firstName: trimInput(firstName),
            lastName: trimInput(lastName),
        });
    };

    const showError = hasAttemptedSubmit && error;

    return (
        <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
        >
            <View style={styles.formContainer}>
                <Card>
                    <View style={styles.sectionHeaderRow}>
                        {/*<Text style={styles.sectionHeader}>Required details</Text>*/}
                        <Text style={styles.sectionTag}>Required</Text>
                    </View>
                    <Text style={styles.sectionHelper}>
                        These fields are needed to verify your identity and secure your account.
                    </Text>

                    <Text style={[styles.label, styles.labelTight]}>Phone Number</Text>
                    <PhoneNumberRow
                        phone={phoneState.phone}
                        onChangePhone={phoneState.setPhone}
                        countryCode={phoneState.selectedCode}
                        onChangeCountry={handleCountryChange}
                        isPickerOpen={phoneState.isPickerOpen}
                        onOpenPicker={phoneState.openPicker}
                        onClosePicker={phoneState.closePicker}
                    />

                    <Text style={[styles.label, styles.labelTight]}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your first name"
                        placeholderTextColor={colors.textMuted}
                        value={firstName}
                        onChangeText={setFirstName}
                    />

                    <Text style={[styles.label, styles.labelTight]}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your last name"
                        placeholderTextColor={colors.textMuted}
                        value={lastName}
                        onChangeText={setLastName}
                    />

                    {showError && <Text style={styles.errorText}>{error}</Text>}
                </Card>

                <PrimaryButton title="Continue" onPress={handleContinue} />
            </View>
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
        maxWidth: 520,
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
    sectionTag: {
        ...typography.helper,
        color: colors.accent,
    },
    sectionHelper: {
        ...typography.helper,
        marginBottom: spacing.xl,
    },
    label: {
        ...typography.label,
        marginBottom: spacing.lg,
    },
    labelTight: {
        marginBottom: spacing.sm,
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
    errorText: {
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
        fontSize: 12,
        color: colors.errorAccent,
    },
});

export default RequiredDetailsForm;
