import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { uploadExerciseVideo } from "../../api/workout-api/exercises.api";
import { theme } from "../../theme";

type Props = {
  exerciseId: string;
  onUploaded?: (url: string) => void;
};

export default function ExerciseVideoUploader({ exerciseId, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handlePick = () => {
    if (Platform.OS === "web") {
      inputRef.current?.click();
      return;
    }

    Alert.alert("העלאת וידאו", "בחירת וידאו נתמכת כרגע בגרסת web בלבד.");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFileName(selected.name);

    // Create a local preview for instant feedback on web
    if (Platform.OS === "web") {
      const objectUrl = URL.createObjectURL(selected);
      setPreviewUrl((prev) => {
        if (prev && prev.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return objectUrl;
      });
    }
  };

  const handleUpload = async () => {
    if (!inputRef.current?.files?.length) return;
    const selected = inputRef.current.files[0];
    setUploading(true);
    try {
      const url = await uploadExerciseVideo(exerciseId, selected);
      setFileName("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setPreviewUrl(url);
      onUploaded?.(url);
    } catch (error) {
      Alert.alert("שגיאה", "לא הצלחנו להעלות את הוידאו.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePick} style={styles.pickButton}>
        <Text style={styles.pickText}>{fileName || "בחרו וידאו"}</Text>
      </Pressable>

      <Pressable
        onPress={handleUpload}
        disabled={!fileName || uploading}
        style={[
          styles.uploadButton,
          { backgroundColor: !fileName ? "#cbd5e1" : "#22c55e" },
        ]}
      >
        <Text style={styles.uploadText}>
          {uploading ? "מעלה..." : "העלה וידאו"}
        </Text>
      </Pressable>

      {Platform.OS === "web" ? (
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      ) : null}

      {previewUrl ? (
        <View style={styles.previewWrapper}>
          {Platform.OS === "web" ? (
            <video
              src={previewUrl}
              controls
              style={{ width: "100%", borderRadius: 12 }}
              playsInline
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  pickButton: {
    flex: 1,
    backgroundColor: theme.card.bg,
    borderColor: theme.card.border,
    borderWidth: 1,
    borderRadius: theme.card.radius,
    padding: 12,
  },
  pickText: {
    textAlign: "right",
    color: theme.text.title,
  },
  uploadButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.card.radius,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  previewWrapper: {
    marginTop: 12,
    width: "100%",
  },
});