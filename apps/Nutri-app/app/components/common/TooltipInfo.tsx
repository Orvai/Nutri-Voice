import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { radii } from "../../styles/dimens";
import { typography } from "../../styles/typography";
import { globalStyles } from "../../styles/globalStyles";

type TooltipInfoProps = {
    title: string;
    messages: string[];
};

const TooltipInfo: React.FC<TooltipInfoProps> = ({ title, messages }) => (
    <View style={[globalStyles.tooltip, styles.tooltip]}>
        <Text style={styles.title}>{title}</Text>
        {messages.map((message) => (
            <Text key={message} style={styles.text}>
                {message}
            </Text>
        ))}
    </View>
);

const styles = StyleSheet.create({
    tooltip: {
        marginTop: spacing.sm,
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.helper,
        fontWeight: "600",
        marginBottom: spacing.xs,
        color: colors.textInfo,
    },
    text: {
        ...typography.helper,
        color: colors.textInfo,
        lineHeight: 17,
    },
});

export default TooltipInfo;
