import { ReactNode } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../../theme";

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  style?: ViewStyle;
};

export function SectionHeader({ title, subtitle, action, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  textContainer: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.text.title,
    textAlign: "right",
  },
  subtitle: {
    fontSize: 12,
    color: theme.text.subtitle,
    textAlign: "right",
  },
});