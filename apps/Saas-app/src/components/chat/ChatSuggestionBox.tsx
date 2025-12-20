import { View, TextInput, Pressable, Text } from "react-native";
import { useState } from "react";
import { styles } from "./styles/ChatSuggestionBox.styles";

interface Props {
  initialText: string;
  onSend: (text: string) => void;
}

export default function ChatSuggestionBox({
  initialText,
  onSend,
}: Props) {
  const [text, setText] = useState(initialText);

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        style={styles.input}
      />

      <Pressable
        onPress={() => onSend(text)}
        style={styles.sendButton}
      >
        <Text style={styles.sendText}>שלח</Text>
      </Pressable>
    </View>
  );
}
