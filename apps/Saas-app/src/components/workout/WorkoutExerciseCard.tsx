import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { UIExercise } from "@/types/ui/workout/exercise.ui";
import { Card } from "./common/Card";
import { Tag } from "./common/Tag";
import { theme } from "../../theme";

import ExerciseVideoPlayer from "./ExerciseVideoPlayer";
import ExerciseVideoUploader from "./ExerciseVideoUploader";
import { styles } from "./styles/WorkoutExerciseCard.styles";

type Props = {
  item: UIExercise;
  onPress?: () => void;
};

export default function WorkoutExerciseCard({ item, onPress }: Props) {
  const [videoOpen, setVideoOpen] = useState(false);
  const hasVideo = Boolean(item.videoUrl);

  // Wrapper only for the CARD (Uploader will be outside to avoid nested Pressables)
  const Wrapper: any = onPress ? Pressable : View;

  const openVideo = (e?: any) => {
    // helps on web to prevent bubbling
    e?.stopPropagation?.();
    setVideoOpen(true);
  };

  return (
    <>
      <Wrapper onPress={onPress}>
        <Card style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.title }]}>
              {item.name}
            </Text>
            {item.muscleGroup ? <Tag label={item.muscleGroup} /> : null}
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            {hasVideo ? (
              <Pressable onPress={openVideo} style={styles.videoBtn}>
                <Text style={styles.videoBtnText}>▶ צפה בסרטון</Text>
              </Pressable>
            ) : (
              <Text style={[styles.noVideoText, { color: theme.text.subtitle }]}>
                אין סרטון
              </Text>
            )}
          </View>
        </Card>
      </Wrapper>

      {/* ✅ Upload is OUTSIDE wrapper to ensure it appears & works */}
      {!hasVideo ? (
        <View style={styles.uploaderWrap}>
          <ExerciseVideoUploader
            exerciseId={item.id}
            onUploaded={() => {
            }}
          />
        </View>
      ) : null}

      <ExerciseVideoPlayer
        exercise={item}
        visible={videoOpen}
        onClose={() => setVideoOpen(false)}
      />
    </>
  );
}
