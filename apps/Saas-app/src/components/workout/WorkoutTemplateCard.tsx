import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  mapTemplateLevel,
  type UIWorkoutProgram,
  type UIWorkoutTemplate,
} from "../../types/ui/workout-ui";
import { Chip } from "./common/Chip";
import { AvatarBadge } from "./common/AvatarBadge";
import { theme } from "../../theme";

const palette = ["#4f46e5", "#0ea5e9", "#16a34a", "#f97316", "#06b6d4"];

type Props = {
  program: UIWorkoutTemplate;
  onSelect?: (program: UIWorkoutTemplate) => void;
};

export default function WorkoutTemplateCard({ program, onSelect }: Props) {
  const badge = program.name?.slice(0, 2) || "W";
  const accent = palette[Math.abs(hashString(program.id)) % palette.length];
  const muscleTags = Array.from(new Set(program.muscleGroups ?? [])).slice(0, 6);

  return (
    <Pressable onPress={() => onSelect?.(program)} style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <AvatarBadge label={badge} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{program.name}</Text>
            <Text style={styles.subtitle}>{program.workoutType || "תוכנית אימון"}</Text>
          </View>
          <View style={styles.iconStack}>
            <Text style={styles.iconText}>⚧ {program.gender}</Text>
            {program.bodyType ? <Text style={styles.iconText}>🏋️‍♂️ {program.bodyType}</Text> : null}
            <Text style={styles.iconText}>
              ⭐ {translateLevel(mapTemplateLevel(program.level))}
            </Text>
          </View>
        </View>

        <View style={styles.thumbnailRow}>
          <View style={styles.thumbnail}>
            <Text style={styles.thumbnailNumber}>{muscleTags.length || 0}</Text>
            <Text style={styles.thumbnailLabel}>תרגילים</Text>
          </View>
          <View style={styles.tagsRow}>
            {muscleTags.length === 0 ? (
              <Chip label="ללא שיוך שריר" />
            ) : (
              muscleTags.map((muscle) => <Chip key={muscle} label={muscle} />)
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function translateLevel(level: UIWorkoutProgram["level"]) {
  switch (level) {
    case "beginner":
      return "מתחיל";
    case "intermediate":
      return "ביניים";
    case "advanced":
      return "מתקדם";
    default:
      return "";
  }
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.card.border,
    overflow: "hidden",
    flexDirection: "row",
    ...theme.shadow.base,
  },
  accent: {
    width: 6,
  },
  cardContent: {
    padding: 14,
    flex: 1,
    gap: 10,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "right",
    color: theme.text.title,
  },
  subtitle: {
    fontSize: 12,
    color: theme.text.subtitle,
    textAlign: "right",
  },
  iconStack: {
    alignItems: "flex-end",
    gap: 4,
  },
  iconText: {
    fontSize: 12,
    color: theme.text.subtitle,
    textAlign: "right",
  },
  thumbnailRow: {
    flexDirection: "row-reverse",
    gap: 10,
    alignItems: "center",
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.card.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  thumbnailNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.text.title,
  },
  thumbnailLabel: {
    fontSize: 12,
    color: theme.text.subtitle,
  },
  tagsRow: {
    flex: 1,
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
  },
});