import { useRef, useState, type ChangeEvent } from "react";
import {
  Alert,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

import { theme } from "../../theme";
import { useUploadExerciseVideo } from "@/hooks/workout/exercise/useUploadExerciseVideo";
import { styles } from "./styles/ExerciseVideoUploader.styles";

type Props = {
  exerciseId: string;
  onUploaded?: () => void;
};

type NativeFileLike = {
  uri: string;
  name: string;
  type: string;
};

export default function ExerciseVideoUploader({
  exerciseId,
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [nativeFile, setNativeFile] = useState<NativeFileLike | null>(null);

  const uploadMutation = useUploadExerciseVideo();

  /* =========================
     Pick file
  ========================= */

  const handlePick = async () => {
    try {
      if (Platform.OS === "web") {
        inputRef.current?.click();
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      setNativeFile({
        uri: asset.uri,
        name: asset.name ?? "video.mp4",
        type: asset.mimeType ?? "video/mp4",
      });

      setFileName(asset.name ?? "video.mp4");
    } catch {
      Alert.alert("שגיאה", "לא הצלחנו לבחור קובץ וידאו");
    }
  };

  const handleWebFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
  };

  /* =========================
     Upload
  ========================= */

  const handleUpload = () => {
    if (Platform.OS === "web") {
      const file = inputRef.current?.files?.[0];
      if (!file) return;

      uploadMutation.mutate(
        { id: exerciseId, file },
        {
          onSuccess: () => {
            setFileName("");
            if (inputRef.current) inputRef.current.value = "";
            onUploaded?.();
          },
          onError: () =>
            Alert.alert("שגיאה", "העלאת הווידאו נכשלה"),
        }
      );

      return;
    }

    if (!nativeFile) return;

    uploadMutation.mutate(
      { id: exerciseId, file: nativeFile as any },
      {
        onSuccess: () => {
          setNativeFile(null);
          setFileName("");
          onUploaded?.();
        },
        onError: () =>
          Alert.alert("שגיאה", "העלאת הווידאו נכשלה"),
      }
    );
  };

  /* =========================
     Render
  ========================= */

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePick}
        style={[
          styles.pickButton,
          {
            backgroundColor: theme.card.bg,
            borderColor: theme.card.border,
            borderRadius: theme.card.radius,
          },
        ]}
      >
        <Text
          style={[
            styles.pickText,
            { color: theme.text.title },
          ]}
        >
          {fileName || "בחר קובץ וידאו"}
        </Text>
      </Pressable>

      <Pressable
        onPress={handleUpload}
        disabled={!fileName || uploadMutation.isPending}
        style={[
          styles.uploadButton,
          {
            borderRadius: theme.card.radius,
            backgroundColor:
              !fileName || uploadMutation.isPending
                ? undefined
                : "#22c55e",
          },
          (!fileName || uploadMutation.isPending) &&
            styles.uploadDisabled,
        ]}
      >
        <Text style={styles.uploadText}>
          {uploadMutation.isPending ? "מעלה…" : "העלה"}
        </Text>
      </Pressable>

      {Platform.OS === "web" && (
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={handleWebFileChange}
        />
      )}
    </View>
  );
}
