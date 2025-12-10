import { Text, View, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { theme } from "../../../theme";

type Props = {
  label: string;
  tone?: "muted" | "info" | "success" | "warning";
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Tag({ label, tone = "muted", style, textStyle }: Props) {
  const palette = {
    muted: { bg: "#f3f4f6", color: theme.text.title },
    info: { bg: "#e0f2fe", color: "#075985" },
    success: { bg: "#dcfce7", color: "#166534" },
    warning: { bg: "#fef3c7", color: "#92400e" },
  } as const;

  const colors = palette[tone];

  return (
    <View style={[styles.tag, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.text, { color: colors.color }, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    fontSize: 12,
    textAlign: "right",
  },
});