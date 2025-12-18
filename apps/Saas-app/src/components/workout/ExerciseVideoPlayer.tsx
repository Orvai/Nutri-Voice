import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Video, ResizeMode } from "expo-av";

import type { UIExercise } from "@/types/ui/workout/exercise.ui";
import { theme } from "../../theme";

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
        <Pressable style={styles.modalCard} onPress={() => {}}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{exercise.name}</Text>

            <Pressable onPress={onClose} hitSlop={14}>
              <Text style={styles.close}>✕</Text>
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },

  modalCard: {
    backgroundColor: theme.card.bg,
    borderRadius: theme.card.radius,
    padding: 16,
    gap: 12,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },

  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "800",
    fontSize: 16,
    color: theme.text.title,
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },

  close: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.text.subtitle,
  },

  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  video: {
    width: "100%",
    height: "100%",
  },
});
