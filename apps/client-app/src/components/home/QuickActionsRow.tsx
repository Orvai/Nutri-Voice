import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NeonCard } from "@/components/ui/NeonCard";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type ActionItem = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

type QuickActionsRowProps = {
  actions: ActionItem[];
};

export function QuickActionsRow({ actions }: QuickActionsRowProps) {
  return (
    <NeonCard>
      <View style={styles.container}>
        <Text style={styles.title}>פעולות מהירות</Text>
        <View style={styles.actionsRow}>
          {actions.map((action) => (
            <Pressable key={action.key} style={styles.actionButton} onPress={action.onPress}>
              <Ionicons name={action.icon} color={colors.neon} size={18} />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right"
  },
  actionsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  actionButton: {
    flex: 1,
    minHeight: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.surfaceElevated
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600"
  }
});
