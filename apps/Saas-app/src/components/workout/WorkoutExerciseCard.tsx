import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import type { UIExercise } from "@/types/ui/workout/exercise.ui";
import { useDeleteExerciseVideo } from "@/hooks/workout/exercise/useDeleteExerciseVideo";
import { Card } from "./common/Card";
import { Tag } from "./common/Tag";
import { theme } from "../../theme";

import ExerciseVideoPlayer from "./ExerciseVideoPlayer";
import ExerciseVideoUploader from "./ExerciseVideoUploader";
import { styles } from "./styles/WorkoutExerciseCard.styles";

type Props = {
  item: UIExercise;
  onPress?: () => void;
  showMediaActions?: boolean;
};

export default function WorkoutExerciseCard({
  item,
  onPress,
  showMediaActions = true,
}: Props) {
  const [videoOpen, setVideoOpen] = useState(false);
  const hasVideo = Boolean(item.videoUrl);
  const deleteVideoMutation = useDeleteExerciseVideo();

  const Wrapper: any = onPress ? Pressable : View;

  const openVideo = (e?: any) => {
    e?.stopPropagation?.();
    setVideoOpen(true);
  };

  const confirmDeleteVideo = () => {
    Alert.alert("מחיקת סרטון", "למחוק את הסרטון של התרגיל?", [
      { text: "בטל", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: () => {
          deleteVideoMutation.mutate(item.id);
        },
      },
    ]);
  };

  return (
    <>
      <Wrapper onPress={onPress}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.title }]}>
              {item.name}
            </Text>
            {item.muscleGroup ? <Tag label={item.muscleGroup} /> : null}
          </View>

          {showMediaActions ? (
            <View style={styles.mediaSection}>
              <View style={styles.actionsRow}>
                {hasVideo ? (
                  <Pressable onPress={openVideo} style={styles.videoBtn}>
                    <Text style={styles.videoBtnText}>▶ צפה בסרטון</Text>
                  </Pressable>
                ) : (
                  <View style={styles.noVideoBadge}>
                    <Text
                      style={[styles.noVideoText, { color: theme.text.subtitle }]}
                    >
                      אין סרטון לתרגיל
                    </Text>
                  </View>
                )}

                {hasVideo ? (
                  <Pressable
                    onPress={confirmDeleteVideo}
                    style={styles.deleteVideoBtn}
                    disabled={deleteVideoMutation.isPending}
                  >
                    <Text style={styles.deleteVideoBtnText}>
                      {deleteVideoMutation.isPending ? "מוחק…" : "מחק סרטון"}
                    </Text>
                  </Pressable>
                ) : null}
              </View>

              <ExerciseVideoUploader
                exerciseId={item.id}
                buttonLabel={hasVideo ? "החלף סרטון" : "העלה סרטון"}
                onUploaded={() => {}}
              />
            </View>
          ) : null}
        </Card>
      </Wrapper>

      <ExerciseVideoPlayer
        exercise={item}
        visible={videoOpen}
        onClose={() => setVideoOpen(false)}
      />
    </>
  );
}
