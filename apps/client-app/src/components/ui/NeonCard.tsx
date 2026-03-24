import type { PropsWithChildren } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type NeonCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function NeonCard({ children, style }: NeonCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md
  }
});
