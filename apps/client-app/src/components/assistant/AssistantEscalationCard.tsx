import { StyleSheet, Text, View } from "react-native";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonCard } from "@/components/ui/NeonCard";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type AssistantEscalationCardProps = {
  pending: boolean;
  onEscalate: () => void;
  loading?: boolean;
};

export function AssistantEscalationCard({
  pending,
  onEscalate,
  loading
}: AssistantEscalationCardProps) {
  return (
    <NeonCard>
      <View style={styles.container}>
        <Text style={styles.title}>פנייה למאמן</Text>
        <Text style={styles.message}>
          {pending
            ? "הפנייה כבר הועברה למאמן, נעדכן ברגע שתהיה תגובה."
            : "אם יש חוסר ודאות או כאב, אפשר להסלים את השיחה למאמן."}
        </Text>
        {!pending ? (
          <NeonButton
            label="העבר למאמן"
            onPress={onEscalate}
            variant="danger"
            loading={loading}
          />
        ) : null}
      </View>
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right"
  },
  message: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "right",
    lineHeight: 20
  }
});
