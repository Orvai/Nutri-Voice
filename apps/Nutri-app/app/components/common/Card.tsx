import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { globalStyles } from "../../styles/globalStyles";

type CardProps = {
    children: React.ReactNode;
    style?: ViewStyle;
};

const Card: React.FC<CardProps> = ({ children, style }) => {
    return <View style={[globalStyles.card, style, styles.card]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        width: "100%",
        alignSelf: "stretch",
        paddingVertical: 28,
        paddingHorizontal: 24,
        borderRadius: globalStyles.card.borderRadius,
    },
});

export default Card;