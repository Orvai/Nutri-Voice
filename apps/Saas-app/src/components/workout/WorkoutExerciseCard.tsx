import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { UIExercise } from "@/types/ui/workout/exercise.ui";
import { Card } from "./common/Card";
import { Tag } from "./common/Tag";
import { theme } from "../../theme";

import ExerciseVideoPlayer from "./ExerciseVideoPlayer";
import ExerciseVideoUploader from "./ExerciseVideoUploader";

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
            <Text style={styles.title}>{item.name}</Text>
            {item.muscleGroup ? <Tag label={item.muscleGroup} /> : null}
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            {hasVideo ? (
              <Pressable onPress={openVideo} style={styles.videoBtn}>
                <Text style={styles.videoBtnText}>▶ צפה בסרטון</Text>
              </Pressable>
            ) : (
              <Text style={styles.noVideoText}>אין סרטון</Text>
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
              // כאן אפשר בעתיד לעשות invalidateQueries / refetch
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

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },

  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "800",
    fontSize: 15,
    color: theme.text.title,
    textAlign: "right",
  },

  actionsRow: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    marginTop: 6,
    alignItems: "center",
    gap: 10,
  },

  videoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#2563eb",
  },

  videoBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  noVideoText: {
    fontSize: 12,
    color: theme.text.subtitle,
    textAlign: "right",
  },

  uploaderWrap: {
    marginTop: 8,
  },
});
