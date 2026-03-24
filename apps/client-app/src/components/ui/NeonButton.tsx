import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type ButtonVariant = "accent" | "secondary" | "ghost" | "danger";

type NeonButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
};

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border: string }> = {
  accent: {
    bg: colors.neon,
    text: colors.black,
    border: colors.neon
  },
  secondary: {
    bg: colors.surfaceElevated,
    text: colors.white,
    border: colors.border
  },
  ghost: {
    bg: "transparent",
    text: colors.neon,
    border: colors.neonSoft
  },
  danger: {
    bg: colors.danger,
    text: colors.white,
    border: colors.danger
  }
};

export function NeonButton({
  label,
  onPress,
  variant = "accent",
  loading = false,
  disabled = false
}: NeonButtonProps) {
  const palette = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: pressed || disabled ? 0.8 : 1
        }
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.pill,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center"
  },
  label: {
    fontSize: 15,
    fontWeight: "700"
  }
});
