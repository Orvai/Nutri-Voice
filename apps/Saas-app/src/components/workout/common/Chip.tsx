import { Text, View, ViewStyle } from "react-native";
import { theme } from "../../../theme";
import { styles } from "../styles/Chip.styles";

type Props = {
  label: string;
  tone?: "gray" | "primary" | "accent";
  style?: ViewStyle;
};

export function Chip({ label, tone = "gray", style }: Props) {
  const palette = {
    gray: {
      bg: "#f8fafc",
      border: theme.card.border,
      color: theme.text.subtitle,
    },
    primary: {
      bg: "#e0f2fe",
      border: "#bae6fd",
      color: "#075985",
    },
    accent: {
      bg: "#eef2ff",
      border: "#c7d2fe",
      color: "#312e81",
    },
  } as const;

  const colors = palette[tone];

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: colors.color }]}>
        {label}
      </Text>
    </View>
  );
}
