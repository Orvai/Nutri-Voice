import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { NeonButton } from "@/components/ui/NeonButton";
import { spacing } from "@/constants/layout";

type StatusViewProps = {
  type: "loading" | "error" | "empty";
  title: string;
  message?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function StatusView({
  type,
  title,
  message,
  actionLabel,
  onActionPress
}: StatusViewProps) {
  return (
    <View style={styles.container}>
      {type === "loading" ? <ActivityIndicator size="large" color={colors.neon} /> : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onActionPress ? (
        <NeonButton label={actionLabel} onPress={onActionPress} variant="secondary" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    gap: spacing.sm
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center"
  },
  message: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22
  }
});
