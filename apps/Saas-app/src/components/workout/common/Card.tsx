import { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../../theme";

type Props = {
  children: ReactNode;
  style?: ViewStyle;
};

export function Card({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card.bg,
    borderColor: theme.card.border,
    borderRadius: theme.card.radius,
    borderWidth: 1,
    padding: theme.card.padding,
    ...theme.shadow.base,
  },
});