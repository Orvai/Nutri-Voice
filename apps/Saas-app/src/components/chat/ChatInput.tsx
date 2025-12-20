import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/ChatInput.styles";

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "ערוך / אשר תשובת AI",
}: Props) {
  return (
    <View
      style={[
        styles.container,
        disabled && { opacity: 0.5 },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        editable={!disabled}
        multiline
        style={styles.input}
      />

      <Pressable
        onPress={() => onSend(value)}
        disabled={disabled || !value.trim()}
        style={styles.sendButton}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}
