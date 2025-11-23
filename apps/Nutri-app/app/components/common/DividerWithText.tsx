import React from "react";
import { Text, View } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { typography } from "../../styles/typography";

interface DividerWithTextProps {
    label: string;
}

const DividerWithText: React.FC<DividerWithTextProps> = ({ label }) => (
    <View style={globalStyles.dividerRow}>
        <View style={globalStyles.divider} />
        <Text style={globalStyles.dividerText}>{label}</Text>
        <View style={globalStyles.divider} />
    </View>
);

export default DividerWithText;