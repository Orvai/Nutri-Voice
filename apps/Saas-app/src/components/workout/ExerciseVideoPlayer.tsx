import { Modal, Pressable, Text, View } from "react-native";
import { Video, ResizeMode } from "expo-av";

import type { UIExercise } from "@/types/ui/workout/exercise.ui";
import { theme } from "../../theme";
import { styles } from "./styles/ExerciseVideoPlayer.styles";

type Props = {
  exercise: UIExercise;
  visible: boolean;
  onClose: () => void;
};

export default function ExerciseVideoPlayer({
  exercise,
  visible,
  onClose,
}: Props) {
  if (!exercise.videoUrl) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      {/* Overlay – click anywhere to close */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Card – stop propagation */}
        <Pressable
          style={[
            styles.modalCard,
            {
              backgroundColor: theme.card.bg,
              borderRadius: theme.card.radius,
            },
          ]}
          onPress={() => {}}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: theme.text.title },
              ]}
            >
              {exercise.name}
            </Text>

            <Pressable onPress={onClose} hitSlop={14}>
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

          {/* Video */}
          <View style={styles.videoWrapper}>
            <Video
              source={{ uri: exercise.videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
