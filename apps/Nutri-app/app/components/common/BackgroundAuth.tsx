import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

type BackgroundAuthProps = {
    children: React.ReactNode;
};

const BackgroundAuth: React.FC<BackgroundAuthProps> = ({ children }) => (
    <View style={styles.background}>{children}</View>
);

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: colors.background,
    },
});

export default BackgroundAuth;