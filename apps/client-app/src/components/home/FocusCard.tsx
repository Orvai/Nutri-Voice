import { StyleSheet, Text, View } from "react-native";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonCard } from "@/components/ui/NeonCard";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type FocusCardProps = {
  actionLabel: string;
  description: string;
  onPress: () => void;
};

export function FocusCard({ actionLabel, description, onPress }: FocusCardProps) {
  return (
    <NeonCard>
      <View style={styles.container}>
        <View style={styles.copy}>
          <Text style={styles.title}>הפוקוס של היום</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <NeonButton label={actionLabel} onPress={onPress} />
      </View>
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md
  },
  copy: {
    gap: spacing.xs
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
    textAlign: "right"
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: "right"
  }
});
