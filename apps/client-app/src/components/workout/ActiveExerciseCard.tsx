import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NeonCard } from "@/components/ui/NeonCard";
import type { ActiveExerciseLog } from "@/types/workout/workout.ui";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type ActiveExerciseCardProps = {
  exercise: ActiveExerciseLog;
  onCompleteSet: (setNumber: number, reps: number, weightKg: number) => void;
  isUpdating: boolean;
};

type DraftState = Record<number, { reps: number; weightKg: number }>;

export function ActiveExerciseCard({
  exercise,
  onCompleteSet,
  isUpdating
}: ActiveExerciseCardProps) {
  const initialDraft = useMemo<DraftState>(() => {
    return exercise.sets.reduce((acc, set) => {
      acc[set.setNumber] = {
        reps: set.reps,
        weightKg: set.weightKg
      };
      return acc;
    }, {} as DraftState);
  }, [exercise.sets]);

  const [draft, setDraft] = useState<DraftState>(initialDraft);

  useEffect(() => {
    setDraft(initialDraft);
  }, [initialDraft]);

  return (
    <NeonCard>
      <View style={styles.container}>
        <Text style={styles.title}>{exercise.name}</Text>
        {exercise.sets.map((set) => {
          const values = draft[set.setNumber] ?? { reps: set.reps, weightKg: set.weightKg };

          return (
            <View key={set.setNumber} style={styles.setRow}>
              <View style={styles.controls}>
                <View style={styles.controlGroup}>
                  <Pressable
                    style={styles.controlButton}
                    disabled={set.completed}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        [set.setNumber]: {
                          ...values,
                          reps: Math.max(1, values.reps - 1)
                        }
                      }))
                    }
                  >
                    <Text style={styles.controlButtonText}>-</Text>
                  </Pressable>
                  <Text style={styles.value}>{values.reps} חזרות</Text>
                  <Pressable
                    style={styles.controlButton}
                    disabled={set.completed}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        [set.setNumber]: {
                          ...values,
                          reps: values.reps + 1
                        }
                      }))
                    }
                  >
                    <Text style={styles.controlButtonText}>+</Text>
                  </Pressable>
                </View>

                <View style={styles.controlGroup}>
                  <Pressable
                    style={styles.controlButton}
                    disabled={set.completed}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        [set.setNumber]: {
                          ...values,
                          weightKg: Math.max(0, values.weightKg - 2.5)
                        }
                      }))
                    }
                  >
                    <Text style={styles.controlButtonText}>-</Text>
                  </Pressable>
                  <Text style={styles.value}>{values.weightKg} ק״ג</Text>
                  <Pressable
                    style={styles.controlButton}
                    disabled={set.completed}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        [set.setNumber]: {
                          ...values,
                          weightKg: values.weightKg + 2.5
                        }
                      }))
                    }
                  >
                    <Text style={styles.controlButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                disabled={set.completed || isUpdating}
                onPress={() => onCompleteSet(set.setNumber, values.reps, values.weightKg)}
                style={[
                  styles.completeButton,
                  set.completed && styles.completeButtonDone,
                  (set.completed || isUpdating) && styles.completeButtonDisabled
                ]}
              >
                <Text
                  style={[
                    styles.completeButtonLabel,
                    set.completed && styles.completeButtonLabelDone
                  ]}
                >
                  {set.completed ? "בוצע" : `סיים סט ${set.setNumber}`}
                </Text>
              </Pressable>
            </View>
          );
        })}
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
  setRow: {
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.sm
  },
  controls: {
    gap: spacing.xs
  },
  controlGroup: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between"
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center"
  },
  controlButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700"
  },
  value: {
    color: colors.textSecondary,
    fontSize: 13
  },
  completeButton: {
    minHeight: 36,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.neon,
    backgroundColor: colors.neon,
    alignItems: "center",
    justifyContent: "center"
  },
  completeButtonDone: {
    backgroundColor: colors.neonSoft,
    borderColor: colors.neonSoft
  },
  completeButtonDisabled: {
    opacity: 0.9
  },
  completeButtonLabel: {
    color: colors.black,
    fontWeight: "700",
    fontSize: 13
  },
  completeButtonLabelDone: {
    color: colors.neon
  }
});
