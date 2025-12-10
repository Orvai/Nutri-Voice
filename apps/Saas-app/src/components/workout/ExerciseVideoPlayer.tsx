import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Video, ResizeMode } from "expo-av";
import type { UIExercise } from "../../types/ui/workout-ui";
import ExerciseVideoUploader from "./ExerciseVideoUploader";
import { theme } from "../../theme";

type Props = {
  exercise: UIExercise;
  visible: boolean;
  onClose: () => void;
  onUpdated?: (videoUrl: string) => void;
};

export default function ExerciseVideoPlayer({
  exercise,
  visible,
  onClose,
  onUpdated,
}: Props) {
  const [videoUrl, setVideoUrl] = useState(exercise.videoUrl ?? "");
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    setVideoUrl(exercise.videoUrl ?? "");
  }, [exercise.id, exercise.videoUrl]);

  const handleUploaded = (url: string) => {
    setVideoUrl(url);
    onUpdated?.(url);
  };

  const handleFullscreen = async () => {
    if (videoRef.current?.presentFullscreenPlayer) {
      await videoRef.current.presentFullscreenPlayer();
      return;
    }

    // Web fallback
    const nativeRef: any = videoRef.current as any;
    if (nativeRef?.requestFullscreen) {
      nativeRef.requestFullscreen();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>{exercise.name}</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          {videoUrl ? (
            <Video
              ref={videoRef}
              source={{ uri: videoUrl }}
              style={styles.video}
              useNativeControls
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>אין וידאו זמין</Text>
            </View>
          )}

          {videoUrl ? (
            <View style={styles.actionsRow}>
              <Pressable onPress={handleFullscreen} style={styles.fullscreenButton}>
                <Text style={styles.fullscreenText}>מסך מלא</Text>
              </Pressable>
            </View>
          ) : null}

          <ExerciseVideoUploader
            exerciseId={exercise.id}
            onUploaded={handleUploaded}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    backgroundColor: theme.card.bg,
    borderRadius: theme.card.radius,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.text.title,
    textAlign: "right",
  },
  close: {
    fontSize: 18,
    color: theme.text.subtitle,
  },
  video: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#000",
  },
  actionsRow: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    marginTop: 6,
  },
  fullscreenButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#0ea5e9",
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  fullscreenText: {
    color: "#fff",
    fontWeight: "700",
  },
  placeholder: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.card.border,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: theme.text.subtitle,
  },
});