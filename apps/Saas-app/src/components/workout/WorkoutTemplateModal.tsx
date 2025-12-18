import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import type { UIWorkoutTemplate } from "@/types/ui/workout/workoutTemplate.ui";
import type { UIExercise } from "@/types/ui/workout/exercise.ui";

import type {
  WorkoutTemplateCreateRequestDto,
} from "@common/api/sdk/schemas";

import WorkoutTemplateForm from "./WorkoutTemplateForm";
import { theme } from "../../theme";

type Props = {
  visible: boolean;
  initialTemplate?: UIWorkoutTemplate | null;
  exercises?: UIExercise[];
  onClose: () => void;

  // ✅ DTO של ה־API בלבד
  onSubmit: (payload: WorkoutTemplateCreateRequestDto) => Promise<void> | void;
};

export default function WorkoutTemplateModal({
  visible,
  initialTemplate,
  exercises = [],
  onClose,
  onSubmit,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {initialTemplate ? "עריכת תבנית" : "תבנית חדשה"}
            </Text>

            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <WorkoutTemplateForm
            initialTemplate={initialTemplate}
            exercises={exercises}
            onCancel={onClose}
            onSubmit={async (payload) => {
              await onSubmit(payload);
              onClose();
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
    padding: 14,
  },

  card: {
    backgroundColor: theme.card.bg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.card.border,
    overflow: "hidden",
    maxHeight: "92%",
  },

  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.card.border,
    backgroundColor: theme.card.bg,
  },

  title: {
    fontWeight: "900",
    fontSize: 16,
    color: theme.text.title,
    textAlign: "right",
  },

  close: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.text.subtitle,
  },
});
