import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { AssistantQuickAction } from "@/types/assistant/assistant.ui";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type AssistantQuickActionsProps = {
  onAction: (action: AssistantQuickAction) => void;
  disabled?: boolean;
};

const actions: Array<{
  key: AssistantQuickAction;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { key: "meal", label: "ארוחה", icon: "restaurant-outline" },
  { key: "workout", label: "אימון", icon: "barbell-outline" },
  { key: "water", label: "מים", icon: "water-outline" },
  { key: "calories", label: "קלוריות", icon: "flame-outline" }
];

export function AssistantQuickActions({
  onAction,
  disabled
}: AssistantQuickActionsProps) {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.key}
          disabled={disabled}
          style={styles.button}
          onPress={() => onAction(action.key)}
        >
          <Ionicons name={action.icon} size={18} color={colors.neon} />
          <Text style={styles.label}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  button: {
    width: "48%",
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600"
  }
});
