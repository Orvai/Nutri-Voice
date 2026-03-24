import { Image, StyleSheet, Text, View } from "react-native";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type CoachTipCardProps = {
  coachName: string;
  coachAvatarUrl: string;
  message: string;
  onOpenAssistant: () => void;
};

export function CoachTipCard({
  coachName,
  coachAvatarUrl,
  message,
  onOpenAssistant
}: CoachTipCardProps) {
  return (
    <NeonCard>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.title}>טיפ מהמאמן</Text>
            <Text style={styles.coachName}>{coachName}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          <Image source={{ uri: coachAvatarUrl }} style={styles.avatar} />
        </View>
        <NeonButton label="פתח בעוזר" onPress={onOpenAssistant} variant="secondary" />
      </View>
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md
  },
  row: {
    flexDirection: "row-reverse",
    gap: spacing.md
  },
  copy: {
    flex: 1,
    gap: spacing.xs
  },
  title: {
    color: colors.neon,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right"
  },
  coachName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right"
  },
  message: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "right"
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border
  }
});
