import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NeonButton } from "@/components/ui/NeonButton";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type PostComposerProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (text: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export function PostComposer({
  visible,
  onClose,
  onSubmit,
  loading,
  error
}: PostComposerProps) {
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    await onSubmit(value);
    setValue("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => null}>
          <Text style={styles.title}>פוסט קצר לקהילה</Text>

          <TextInput
            multiline
            value={value}
            onChangeText={setValue}
            placeholder="מה העדכון שלך היום?"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            textAlign="right"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <NeonButton label="פרסם" onPress={handleSubmit} loading={loading} />
            <NeonButton label="ביטול" onPress={onClose} variant="secondary" />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end"
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.md
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right"
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    color: colors.white,
    fontSize: 14
  },
  actions: {
    gap: spacing.xs
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    textAlign: "right"
  }
});
