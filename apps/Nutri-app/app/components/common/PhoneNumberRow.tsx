import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import CountrySelector from "./CountrySelector";
import { colors } from "../../styles/colors";
import { radii } from "../../styles/dimens";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";

interface PhoneNumberRowProps {
    phone: string;
    onChangePhone: (value: string) => void;
    countryCode: string;
    onChangeCountry: (code: string) => void;
    isPickerOpen: boolean;
    onOpenPicker: () => void;
    onClosePicker: () => void;
    placeholder?: string;
}

const PhoneNumberRow: React.FC<PhoneNumberRowProps> = ({ phone, onChangePhone, countryCode, onChangeCountry, isPickerOpen, onOpenPicker, onClosePicker, placeholder = "123 456 7890",}) => (
    <View style={styles.row}>
        <View style={styles.selectorWrapper}>
            <CountrySelector
                selectedCode={countryCode}
                isOpen={isPickerOpen}
                onOpen={onOpenPicker}
                onClose={onClosePicker}
                onSelect={onChangeCountry}
            />
        </View>
        <View style={styles.phoneInputWrapper}>
            <TextInput
                style={styles.phoneInput}
                value={phone}
                onChangeText={onChangePhone}
                keyboardType="phone-pad"
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
            />
        </View>
    </View>
);
const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.lg,
        alignItems: "center",
        marginBottom: spacing.sm,
        width: "100%",
    },
    selectorWrapper: {
        flexShrink: 0,
    },
    phoneInputWrapper: {
        flex: 1,
        minHeight: 48,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.white,
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
    },
    phoneInput: {
        flex: 1,
        fontSize: typography.button.fontSize,
        color: colors.textPrimary,
        paddingLeft: 2,
    },
});

export default PhoneNumberRow;