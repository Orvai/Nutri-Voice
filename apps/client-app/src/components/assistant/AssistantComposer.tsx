import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type AssistantComposerProps = {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
};

export function AssistantComposer({ onSend, disabled }: AssistantComposerProps) {
  const [value, setValue] = useState("");

  const handleSend = async () => {
    if (!value.trim()) {
      return;
    }

    await onSend(value.trim());
    setValue("");
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={disabled}
      >
        <Ionicons name="send" size={18} color={colors.black} />
      </Pressable>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="כתוב הודעה לעוזר..."
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        textAlign="right"
        editable={!disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.neon,
    alignItems: "center",
    justifyContent: "center"
  },
  sendButtonDisabled: {
    opacity: 0.6
  },
  input: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    color: colors.white,
    fontSize: 14,
    paddingHorizontal: spacing.md
  }
});
