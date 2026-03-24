import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type AuthScaffoldProps = PropsWithChildren<{
  title: string;
  subtitle: string;
}>;

export function AuthScaffold({ title, subtitle, children }: AuthScaffoldProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.xl
  },
  header: {
    gap: spacing.xs
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "right"
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "right",
    lineHeight: 22
  }
});
