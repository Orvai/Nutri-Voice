import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { NeonButton } from "@/components/ui/NeonButton";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";
import type { HomeSnapshot } from "@/types/home/home.ui";

type NextWorkoutCardProps = {
  workout: NonNullable<HomeSnapshot["nextWorkout"]>;
  onOpenWorkout: () => void;
};

export function NextWorkoutCard({ workout, onOpenWorkout }: NextWorkoutCardProps) {
  return (
    <ImageBackground
      source={{ uri: workout.thumbnailUrl }}
      style={styles.background}
      imageStyle={styles.image}
    >
      <View style={styles.overlay}>
        <Text style={styles.category}>{workout.category}</Text>
        <Text style={styles.title}>{workout.title}</Text>
        <Text style={styles.meta}>{workout.metaLabel}</Text>
        <NeonButton label="התחל אימון" onPress={onOpenWorkout} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    minHeight: 210,
    borderRadius: radius.lg,
    overflow: "hidden"
  },
  image: {
    borderRadius: radius.lg
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: spacing.md,
    justifyContent: "flex-end",
    gap: spacing.xs
  },
  category: {
    color: colors.neon,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "700"
  },
  title: {
    color: colors.white,
    textAlign: "right",
    fontSize: 24,
    fontWeight: "800"
  },
  meta: {
    color: colors.textSecondary,
    textAlign: "right",
    fontSize: 13,
    marginBottom: spacing.sm
  }
});
