import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";
import { NeonButton } from "@/components/ui/NeonButton";
import type { WorkoutProgram } from "@/types/workout/workout.ui";

type WorkoutProgramCardProps = {
  program: WorkoutProgram;
  onOpen: () => void;
  onStart: () => void;
};

export function WorkoutProgramCard({
  program,
  onOpen,
  onStart
}: WorkoutProgramCardProps) {
  return (
    <ImageBackground
      source={{ uri: program.thumbnailUrl }}
      style={styles.background}
      imageStyle={styles.image}
    >
      <View style={styles.overlay}>
        <View style={styles.topRow}>
          {program.isToday ? <Text style={styles.badge}>היום</Text> : <View />}
          <Pressable onPress={onOpen} style={styles.previewAction}>
            <Ionicons name="eye-outline" size={16} color={colors.white} />
            <Text style={styles.previewText}>תצוגה</Text>
          </Pressable>
        </View>

        <View style={styles.copy}>
          <Text style={styles.title}>{program.title}</Text>
          <Text style={styles.meta}>
            {program.category} · {program.durationLabel} · {program.exercisesCount} תרגילים
          </Text>
          <Text style={styles.intensity}>{program.intensityLabel}</Text>
        </View>

        <NeonButton label="התחל אימון" onPress={onStart} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    minHeight: 212,
    borderRadius: radius.lg,
    overflow: "hidden"
  },
  image: {
    borderRadius: radius.lg
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.62)"
  },
  topRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center"
  },
  badge: {
    backgroundColor: colors.neon,
    color: colors.black,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    fontSize: 11,
    fontWeight: "700"
  },
  previewAction: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4
  },
  previewText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600"
  },
  copy: {
    gap: spacing.xs
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "right"
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "right"
  },
  intensity: {
    color: colors.neon,
    fontSize: 12,
    textAlign: "right"
  }
});
