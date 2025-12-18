import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

import type { UIWorkoutTemplate } from "@/types/ui/workout/workoutTemplate.ui";
import type { UIExercise } from "@/types/ui/workout/exercise.ui";

import type {
  WorkoutTemplateCreateRequestDto,
} from "@common/api/sdk/schemas";

import WorkoutTemplateForm from "./WorkoutTemplateForm";
import { theme } from "../../theme";
import { styles } from "./styles/WorkoutTemplateModal.styles";

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
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: theme.card.bg,
              borderColor: theme.card.border,
            },
          ]}
          onPress={() => {}}
        >
          <View
            style={[
              styles.header,
              {
                borderBottomColor: theme.card.border,
                backgroundColor: theme.card.bg,
              },
            ]}
          >
            <Text
              style={[
                styles.title,
                { color: theme.text.title },
              ]}
            >
              {initialTemplate ? "עריכת תבנית" : "תבנית חדשה"}
            </Text>

            <Pressable onPress={onClose} hitSlop={12}>
              <Text
                style={[
                  styles.close,
                  { color: theme.text.subtitle },
                ]}
              >
                ✕
              </Text>
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
