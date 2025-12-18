import { View, Text, StyleSheet, Pressable } from "react-native";

import type { UIWorkoutTemplate } from "@/types/ui/workout/workoutTemplate.ui";
import { AvatarBadge } from "./common/AvatarBadge";
import { theme } from "../../theme";

const palette = ["#4f46e5", "#0ea5e9", "#16a34a", "#f97316", "#06b6d4"];

type Props = {
  program: UIWorkoutTemplate;
  onSelect?: (template: UIWorkoutTemplate) => void;
};

export default function WorkoutTemplateCard({ program, onSelect }: Props) {
  const badge = program.name?.slice(0, 2) || "WT";
  const accent = palette[Math.abs(hashString(program.id)) % palette.length];

  return (
    <Pressable onPress={() => onSelect?.(program)} style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accent }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{program.name || "תבנית אימון"}</Text>
            <Text style={styles.subtitle}>
              {program.workoutType || "Workout Template"}
            </Text>
          </View>

          <AvatarBadge label={badge} />
        </View>

        <View style={styles.metaRow}>
          {program.gender && <Text style={styles.metaText}>⚧ {program.gender}</Text>}
          {program.bodyType && <Text style={styles.metaText}>🏋️ {program.bodyType}</Text>}
          <Text style={styles.metaText}>⭐ {translateLevel(program.level)}</Text>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card.bg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.card.border,
    overflow: "hidden",
    flexDirection: "row",
    ...theme.shadow.base,
  },

  accent: {
    width: 6,
  },

  content: {
    padding: 14,
    flex: 1,
    gap: 10,
  },

  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  headerText: {
    flex: 1,
    alignItems: "flex-end",
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.text.title,
    textAlign: "right",
  },

  subtitle: {
    fontSize: 12,
    color: theme.text.subtitle,
    textAlign: "right",
  },

  metaRow: {
    flexDirection: "row-reverse",
    gap: 12,
    flexWrap: "wrap",
  },

  metaText: {
    fontSize: 12,
    color: theme.text.subtitle,
    textAlign: "right",
  },
});
