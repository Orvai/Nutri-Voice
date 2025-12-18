import { View, Text, Pressable } from "react-native";

import type { UIWorkoutTemplate } from "@/types/ui/workout/workoutTemplate.ui";
import { AvatarBadge } from "./common/AvatarBadge";
import { theme } from "../../theme";
import { styles } from "./styles/WorkoutTemplateCard.styles";

const palette = ["#4f46e5", "#0ea5e9", "#16a34a", "#f97316", "#06b6d4"];

type Props = {
  program: UIWorkoutTemplate;
  onSelect?: (template: UIWorkoutTemplate) => void;
};

export default function WorkoutTemplateCard({ program, onSelect }: Props) {
  const badge = program.name?.slice(0, 2) || "WT";
  const accent = palette[Math.abs(hashString(program.id)) % palette.length];

  return (
    <Pressable
      onPress={() => onSelect?.(program)}
      style={[
        styles.card,
        {
          backgroundColor: theme.card.bg,
          borderColor: theme.card.border,
          ...theme.shadow.base,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: accent }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.text.title }]}>
              {program.name || "תבנית אימון"}
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.subtitle }]}>
              {program.workoutType || "Workout Template"}
            </Text>
          </View>

          <AvatarBadge label={badge} />
        </View>

        <View style={styles.metaRow}>
          {program.gender && (
            <Text style={[styles.metaText, { color: theme.text.subtitle }]}>
              ⚧ {program.gender}
            </Text>
          )}
          {program.bodyType && (
            <Text style={[styles.metaText, { color: theme.text.subtitle }]}>
              🏋️ {program.bodyType}
            </Text>
          )}
          <Text style={[styles.metaText, { color: theme.text.subtitle }]}>
            ⭐ {translateLevel(program.level)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function translateLevel(level: number) {
  if (level <= 1) return "מתחיל";
  if (level === 2) return "ביניים";
  return "מתקדם";
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
